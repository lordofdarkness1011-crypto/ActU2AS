import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import {db} from '../prisma/db.js'
import { Factura } from '../models/factura.model.js';
import { DetalleFactura } from '../models/detalle-factura.model.js';
import { ProductoClienteService } from './producto-cliente.service.js';
import { ClienteHttpService } from './cliente-http.service.js';

@Injectable()
export class FacturaService {

        constructor(
            private readonly productoCliente: ProductoClienteService,
            private readonly clienteHttp: ClienteHttpService,
        ) {}
        
    async crear(data: Factura){
        await this.clienteHttp.verificarExistencia(data.cod_cliente);
        const factura = await db.orm.Factura.where({codigo: data.codigo}).first();
        if (factura){
            throw new ConflictException("Codigo ya existe");
        }
        return db.orm.Factura.create({...data,fecha: data.fecha});
    }
    async consultar(codigo: string) {
        const factura = await db.orm.Factura.where({ codigo }).first();

        if (!factura) {
            throw new NotFoundException('Factura no encontrada');
        }

        return factura;
    }

    async listar() {
        return db.orm.Factura.all();
    }

    async actualizar (codigo: string, data: Partial<Factura>){
        const cambios: Record<string, unknown>={...data};
        if (data.fecha){
            cambios.fecha = new Date(data.fecha);
        }
        const factura = await db.orm.Factura.where({codigo:codigo}).update(cambios);
        if (!factura){
            throw new NotFoundException("Factura no encontrada");
        }
        return factura;
    }

    async eliminar(codigo: string) {
        const factura = await db.orm.Factura.where({ codigo }).delete();

        if (!factura) {
        throw new NotFoundException('Factura no encontrada');
        }

        return factura;
    }

    //detalle de factura
  /**
   * Agrega un detalle a la factura.
   * - Consulta el producto en el microservicio y calcula
   *   subtotal = cantidad * producto.precio.
   * - El codigo del detalle se autogenera (máximo actual + 1).
   * - Recalcula total y total_a_pagar de la factura.
   */
    async actualizarDetalle(
        codigo: string,
        codigoDetalle: number,
        data: Partial<Pick<DetalleFactura, 'cod_producto' | 'cantidad' | 'subtotal'>>,
    ) {
        const factura = await this.consultar(codigo);
        const detalles = factura.detalles_factura ?? [];

        const indice = detalles.findIndex((d) => d.codigo === codigoDetalle);
        if (indice === -1) {
        throw new NotFoundException('Detalle no encontrado');
        }

        const actual = detalles[indice];
        const cantidad = data.cantidad ?? actual.cantidad;

        if (!Number.isInteger(cantidad) || cantidad <= 0) {
        throw new BadRequestException('La cantidad debe ser un entero mayor a 0');
        }

        let subtotal = data.subtotal ?? actual.subtotal;
        if (data.subtotal === undefined && data.cantidad !== undefined && actual.cantidad > 0) {
        const precioUnitario = actual.subtotal / actual.cantidad;
        subtotal = precioUnitario * cantidad;
        }

        if (subtotal < 0) {
        throw new BadRequestException('El subtotal no puede ser negativo');
        }

        const actualizado: DetalleFactura = {
        ...actual,
        cod_producto: data.cod_producto ?? actual.cod_producto,
        cantidad,
        subtotal: this.redondear(subtotal),
        };

        const nuevos = detalles.map((d, i) => (i === indice ? actualizado : d));
        return this.guardarDetalles(factura, nuevos);
    }

    /**
     * Elimina un detalle (por su codigo) de la factura
     * y recalcula total y total_a_pagar.
     */
    async eliminarDetalle(codigo: string, codigoDetalle: number) {
        const factura = await this.consultar(codigo);
        const detalles = factura.detalles_factura ?? [];

        const restantes = detalles.filter((d) => d.codigo !== codigoDetalle);
        if (restantes.length === detalles.length) {
        throw new NotFoundException('Detalle no encontrado');
        }

        return this.guardarDetalles(factura, restantes);
    }

    /**
     * Suma los subtotales de los detalles.
     */
    public calcularSubtotal(detalles: Pick<DetalleFactura, 'subtotal'>[]): number {
        const suma = (detalles ?? []).reduce((acc, d) => acc + d.subtotal, 0);
        return this.redondear(suma);
    }

    // ---------- Helpers privados ----------

    private async guardarDetalles(
        factura: Pick<Factura, 'codigo' | 'descuento' | 'iva'>,
        detalles: DetalleFactura[],
    ) {
        const total = this.calcularSubtotal(detalles);

        // Asume que descuento e iva son MONTOS.
        // Si fueran porcentajes:
        //   const conDescuento = total - (total * factura.descuento) / 100;
        //   const totalAPagar = conDescuento + (conDescuento * factura.iva) / 100;
        const totalAPagar = this.redondear(total - factura.descuento + factura.iva);

        await db.orm.Factura.where({ codigo: factura.codigo }).update({
        detalles_factura: detalles,
        total,
        total_a_pagar: totalAPagar,
        });

        return this.consultar(factura.codigo);
    }

    private redondear(valor: number): number {
        return Math.round((valor + Number.EPSILON) * 100) / 100;
    }
    async agregarDetalle(
    codigo: string,
    data: Pick<DetalleFactura, 'cod_producto' | 'cantidad'>,
  ) {
    if (!Number.isInteger(data.cantidad) || data.cantidad <= 0) {
      throw new BadRequestException('La cantidad debe ser un entero mayor a 0');
    }

    // En el contrato cod_factura es Int32, pero Factura.codigo es String
    const codFactura = Number(codigo);
    if (!Number.isInteger(codFactura)) {
      throw new BadRequestException(
        'El codigo de la factura debe ser numérico para registrar detalles',
      );
    }

    const factura = await this.consultar(codigo);
    const detalles = factura.detalles_factura ?? [];

    if (detalles.some((d) => d.cod_producto === data.cod_producto)) {
      throw new ConflictException(
        'El producto ya está en la factura, usa actualizarDetalle',
      );
    }

    const producto = await this.productoCliente.consultar(data.cod_producto);

    const nuevo: DetalleFactura = {
      codigo: detalles.reduce((max, d) => Math.max(max, d.codigo), 0) + 1,
      cod_producto: data.cod_producto,
      cantidad: data.cantidad,
      subtotal: this.redondear(data.cantidad * producto.precio),
    };

    return this.guardarDetalles(factura, [...detalles, nuevo]);
  }
    }

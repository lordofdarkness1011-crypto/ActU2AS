import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import {db} from '../../prisma/db.js'
import { Factura } from '../../models/factura.model.js';
import { DetalleFactura } from '../../models/detalle-factura.model.js';


@Injectable()
export class FacturaService {
    async crear(data: Factura){
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
    }

    async eliminar(codigo: string) {
        const factura = await db.orm.Factura.where({ codigo }).delete();

        if (!factura) {
        throw new NotFoundException('Factura no encontrada');
        }

        return factura;
    }

    //detalle de factura
    async agregarDetalle(codigo: string, data:DetalleFactura){
        
    }
}

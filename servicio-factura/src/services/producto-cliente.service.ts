import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Producto } from '../models/producto.model.js';

@Injectable()
export class ProductoClienteService {
  private readonly url = process.env['PRODUCTO_SERVICE_URL']!;

  async consultar(codigo: number): Promise<Producto> {
    let respuesta: Response;

    try {
      respuesta = await fetch(`${this.url}/${codigo}`);
    } catch {
      throw new ServiceUnavailableException(
        'No se pudo conectar con el microservicio de producto',
      );
    }

    if (respuesta.status === 404) {
      throw new NotFoundException('Producto no encontrado');
    }
    if (!respuesta.ok) {
      throw new ServiceUnavailableException('Error al consultar microservicio');
    }

    return (await respuesta.json()) as Producto;
  }
}
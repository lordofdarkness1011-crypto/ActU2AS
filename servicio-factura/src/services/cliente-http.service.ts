import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';

@Injectable()
export class ClienteHttpService {
  private readonly url = process.env['CLIENTE_SERVICE_URL']!;

  async verificarExistencia(codigo: number): Promise<void> {
    let respuesta: Response;

    try {
      respuesta = await fetch(`${this.url}/${codigo}`);
    } catch {
      throw new ServiceUnavailableException(
        'No se pudo conectar con el microservicio de cliente',
      );
    }

    if (respuesta.status === 404) {
      throw new NotFoundException('Cliente no encontrado');
    }
    if (!respuesta.ok) {
      throw new ServiceUnavailableException(
        'Error al consultar el microservicio de cliente',
      );
    }
  }
}

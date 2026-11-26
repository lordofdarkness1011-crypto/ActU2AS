import { Module } from '@nestjs/common';
import { FacturaController } from './factura.controller.js';
import { FacturaService } from '../../services/factura.service.js';
import { ProductoClienteService } from '../../services/producto-cliente.service.js';
import { ClienteHttpService } from '../../services/cliente-http.service.js';

@Module({
  controllers: [FacturaController],
  providers: [FacturaService, ProductoClienteService, ClienteHttpService],
})
export class FacturaModule { }

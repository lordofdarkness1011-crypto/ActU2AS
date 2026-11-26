import type { FastifyInstance } from "fastify";
import {
  obtenerClientes,
  obtenerClienteID,
  crearCliente,
  actualizarClienteID,
  eliminarCliente,
} from "../controllers/cliente.controller";

export const clienteRouter = (app: FastifyInstance) => {
  app.get("/clientes", obtenerClientes);

  app.get("/clientes/:id", async (req, res) => {
    try {
      const { id } = req.params as any;
      return await obtenerClienteID(id);
    } catch (error: any) {
      const status = error?.message === "Cliente no encontrado" ? 404 : 400;
      res.code(status).send({ mensaje: error?.message ?? "Error al obtener el cliente" });
    }
  });

  app.post("/clientes", async (req, res) => {
    try {
      const cliente = req.body;
      return await crearCliente(cliente);
    } catch (error: any) {
      res.code(400).send({ mensaje: error?.message ?? "Error al crear el cliente" });
    }
  });

  const handleActualizar = async (req: any, res: any) => {
    try {
      const { id } = req.params as any;
      const cliente = req.body;
      return await actualizarClienteID(id, cliente);
    } catch (error: any) {
      const status = error?.message === "Cliente no encontrado" ? 404 : 400;
      res.code(status).send({ mensaje: error?.message ?? "Error al actualizar el cliente" });
    }
  };

  app.put("/clientes/:id", handleActualizar);
  app.patch("/clientes/:id", handleActualizar);

  app.delete("/clientes/:id", async (req, res) => {
    try {
      const { id } = req.params as any;
      return await eliminarCliente(id);
    } catch (error: any) {
      const status = error?.message === "Cliente no encontrado" ? 404 : 400;
      res.code(status).send({ mensaje: error?.message ?? "Error al eliminar el cliente" });
    }
  });
};

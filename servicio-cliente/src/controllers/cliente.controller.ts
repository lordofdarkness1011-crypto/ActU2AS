import { Cliente } from "../models/cliente.model.ts";

export const obtenerClientes = async () => {
  return Cliente.findAll();
};

export const obtenerClienteID = async (id: number) => {
  const cliente = await Cliente.findByPk(id);
  if (!cliente) {
    throw Error("Cliente no encontrado");
  }
  return cliente;
};

export const crearCliente = async (data: any) => {
  if (!data || !data.nombre || !data.direccion || !data.telefono) {
    throw Error("Faltan campos obligatorios (nombre, direccion, telefono)");
  }
  return await Cliente.create(data);
};

export const actualizarClienteID = async (id: number, data: any) => {
  const cliente = await Cliente.findByPk(id);
  if (!cliente) {
    throw Error("Cliente no encontrado");
  }
  await cliente.update(data);
  return cliente;
};

export const eliminarCliente = async (id: number) => {
  const cliente = await Cliente.findByPk(id);
  if (!cliente) {
    throw Error("Cliente no encontrado");
  }
  await cliente.destroy();
  return { mensaje: "Eliminado correctamente" };
};

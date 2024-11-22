const request = require("supertest");
const app = require("../app.js");
const e = require("express");

describe("GET /api/ventas", () => {
  it("devolver todos los registros de la tabla ventas", async () => {
    const res = await request(app).get("/api/ventas");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          Nro_venta: expect.any(Number),
          Cliente_cuil: expect.any(Number),
          Vendedor_leg: expect.any(Number),
          Articulo_id: expect.any(Number),
          Fecha_venta: expect.any(String),
          Nom_sucursal: expect.any(String),
        }),
      ])
    );
  });
});

//este test dejara de funcionar si la venta nro 24 se modifica
describe("GET /api/ventas:nroVenta", () => {
  it("devolver la venta numero 24", async () => {
    const res = await request(app).get("/api/ventas/24");
    expect(res.statusCode).toEqual(200);
    expect(res.body.Nro_venta).toEqual(24);
    expect(res.body.Cliente_cuil).toEqual(20058549653);
    expect(res.body.Vendedor_leg).toEqual(36784);
    expect(res.body.Articulo_id).toEqual(1);
    expect(res.body.Fecha_venta).toEqual("2023-04-29");
    expect(res.body.Nom_sucursal).toEqual("Sucursal A");
  });
});

describe("GET /api/ventas:nroVenta", () => {
  it("devolver 404, ya que no se encontro la venta", async () => {
    const res = await request(app).get("/api/ventas/23");
    expect(res.statusCode).toEqual(404);
    expect(res.body.nro_venta).toEqual("23");
    expect(res.body.encontrado).toBeNull;
    expect(res.body.message).toEqual("Venta no encontrada");
  });
});

const ventaPOST = {
  nro_venta: 50,
  cliente_cuil: 2048884307,
  vendedor_leg: 20009,
  articulo_id: 3,
  fecha_venta: "2023-01-10",
  nom_sucursal: "Sucursal B",
};

describe("POST /api/ventas", () => {
  it("crear una nueva venta, con un Nro_venta autoincremental", async () => {
    const res = await request(app).post("/api/ventas/").send(ventaPOST);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(
      expect.objectContaining({
        Nro_Venta: expect.any(Number),
        Cliente_Cuil: expect.any(Number),
        Vendedor_Leg: expect.any(Number),
        Articulo_Id: expect.any(Number),
        Fecha_Venta: expect.any(String),
        Nom_Sucursal: expect.any(String),
      })
    );
  });
});

const ventaPUT = {
  cliente_cuil: 2048884307,
  vendedor_leg: 20009,
  articulo_id: 3,
  fecha_venta: "2023-01-10",
  nom_sucursal: "Sucursal U",
};

describe("PUT /api/ventas:nroVenta", () => {
  it("actualizar la venta numero 50", async () => {
    const res = await request(app).put("/api/ventas/50").send(ventaPUT);
    expect(res.statusCode).toEqual(200);
    expect(res.body.Cliente_Cuil).toEqual(2048884307);
    expect(res.body.Vendedor_Leg).toEqual(20009);
    expect(res.body.Articulo_Id).toEqual(3);
    expect(res.body.Fecha_Venta).toEqual("2023-01-10");
    expect(res.body.Nom_Sucursal).toEqual("Sucursal U");
  });
});

describe("PUT /api/ventas:nroVenta", () => {
  it("devolver 404, ya que no se encontro la venta", async () => {
    const res = await request(app).put("/api/ventas/21");
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual("Venta no encontrada");
  });
});

describe("DELETE /api/ventas:nroVenta", () => {
  it("borrar la venta numero 50", async () => {
    const res = await request(app).delete("/api/ventas/50");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        Nro_venta: expect.any(Number),
        Cliente_cuil: expect.any(Number),
        Vendedor_leg: expect.any(Number),
        Articulo_id: expect.any(Number),
        Fecha_venta: expect.any(String),
        Nom_sucursal: expect.any(String),
      })
    );
  });
});

describe("DELETE /api/ventas:nroVenta", () => {
  it("devolver 404, ya que no se encontro la venta", async () => {
    const res = await request(app).delete("/api/ventas/21");
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual("Venta no encontrada");
  });
});

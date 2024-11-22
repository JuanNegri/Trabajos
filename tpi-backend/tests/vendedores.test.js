const request = require("supertest");
const app = require("../app");
const vendedoresController = require("../controllers/vendedores.controller.js");


describe("GET /api/vendedores", () => {
  it("Devolveria todos los vendedores", async () => {
    const res = await request(app).get("/api/vendedores");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          legajo: expect.any(Number),
          nombre_vendedor: expect.any(String),
          especialidad: expect.any(String),
          fecha_ingreso: expect.any(String),
        }),
      ])
    );
  });
});

describe("GET /api/vendedores/:legajo", () => {
  it("Devuelve el vendedor con legajo 30000", async () => {
    const res = await request(app).get("/api/vendedores/30000");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        legajo: expect.any(Number),
        nombre_vendedor: expect.any(String),
        especialidad: expect.any(String),
        fecha_ingreso: expect.any(String),
      })
    );
  });
});

describe("POST /api/vendedores", () => {
  it("Devolveria el vendedor creado", async () => {
    const nuevoVendedor = {
      legajo: 30007,
      nombre_vendedor: "Lucas",
      especialidad: "Tecnologia",
      fecha_ingreso: "2023-06-01",
    };
    const res = await request(app).post("/api/vendedores").send(nuevoVendedor);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("legajo");
    expect(res.body.nombre_vendedor).toEqual(nuevoVendedor.nombre_vendedor);
    expect(res.body.especialidad).toEqual(nuevoVendedor.especialidad);
    expect(res.body.fecha_ingreso).toMatch(/^2023-06-01/);
  });
});

describe("PUT /api/vendedores/:legajo", () => {
  it("Devolveria el vendedor actualizado", async () => {
    const actVendedor = {
      nombre_vendedor: "Juan",
      especialidad: "Videojuegos",
      fecha_ingreso: "2023-06-02",
    };
    const res = await request(app)
      .put("/api/vendedores/30006")
      .send(actVendedor);

    expect(res.statusCode).toEqual(200);
    expect(res.body.nombre_vendedor).toEqual(actVendedor.nombre_vendedor);
    expect(res.body.especialidad).toEqual(actVendedor.especialidad);
    expect(res.body.fecha_ingreso).toMatch(/^2023-06-02/);
  });
});

describe("DELETE /api/vendedores/:legajo", () => {
  it("Devolvería el vendedor eliminado", async () => {
    const legajo = await vendedoresController.ultimoLegajo()

    const res = await request(app).delete(`/api/vendedores/${legajo}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.legajo).toEqual(legajo);
    expect(res.body.nombre_vendedor).toEqual(expect.any(String));
    expect(res.body.especialidad).toEqual(expect.any(String));
    expect(res.body.fecha_ingreso).toEqual(expect.any(String));
  });

  it("Devolvería un error si el vendedor no existe", async () => {
    const legajo = 99999;

    const res = await request(app).delete(`/api/vendedores/${legajo}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual("Vendedor no encontrado");
  });
});

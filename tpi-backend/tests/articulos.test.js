const supertest = require("supertest");
const app = require("../app.js");

describe("GET /api/articulos", () => {
  it("devolver todos los registros de la tabla articulos", async () => {
    const res = await supertest.agent(app).get("/api/articulos");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id_articulo: expect.any(Number),
          nombre_articulo: expect.any(String),
          fecha_compra: expect.any(String),
        }),
      ])
    );
  });
});

describe("GET /api/articulos/:id_articulos", () => {
  it("devolver el articulo con el id 2", async () => {
    const res = await supertest.agent(app).get("/api/articulos/2");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        id_articulo: expect.any(Number),
      })
    );
  });
});

describe("GET /api/articulos/:id_articulos", () => {
  it("devolver status 404, el articulo con el id 130 no existe", async () => {
    const res = await supertest.agent(app).get("/api/articulos/130");
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual(
      expect.objectContaining({
        error: expect.any(String),
      })
    );
  });
});

const articulo = {
  id_articulo: 33,
  nombre_articulo: "Alfajor",
  fecha_compra: "2022-05-25",
};

describe("POST /api/articulos/", () => {
  it("crear el articulo con el id 33", async () => {
    const res = await supertest
      .agent(app)
      .post("/api/articulos")
      .send(articulo);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(
      expect.objectContaining({
        id_articulo: expect.any(Number),
        nombre_articulo: expect.any(String),
        fecha_compra: expect.any(String),
      })
    );
  });
});

const modificar = {
  nombre_articulo: "Galletas Oreo",
  fecha_compra: "2001-10-26",
};

describe("PUT /api/articulos/:id_articulos", () => {
  it("modificar el articulo con el id 33", async () => {
    const res = await supertest
      .agent(app)
      .put("/api/articulos/33")
      .send(modificar);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(
      expect.objectContaining({
        nombre_articulo: expect.any(String),
        fecha_compra: expect.any(String),
      })
    );
  });
});

describe("PUT /api/articulos/:id_articulo", () => {
  it("devuelve status 404 al querer modificar el articulo con id 2009 que no existe", async () => {
    const res = await supertest
      .agent(app)
      .put("/api/articulos/2009")
      .send(modificar);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual(
      expect.objectContaining({
        error: expect.any(String),
      })
    );
  });
});

describe("DELETE /api/articulos/:id_articulo", () => {
  it("devuelve el articulo eliminado con el id 33", async () => {
    const res = await supertest.agent(app).delete("/api/articulos/33");
    expect(res.statusCode).toEqual(202);
    expect(res.body).toEqual(
      expect.objectContaining({
        id_articulo: expect.any(Number),
        nombre_articulo: expect.any(String),
        fecha_compra: expect.any(String),
      })
    );
  });
});

describe("DELETE /api/articulos/:id_articulo", () => {
  it("devuelve status 404 al querer eliminar el articulo con el id 2006", async () => {
    const res = await supertest.agent(app).delete("/api/articulos/2006");
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual(
      expect.objectContaining({
        error: expect.any(String),
      })
    );
  });
});

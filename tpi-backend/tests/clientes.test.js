const supertest = require('supertest')
const app = require('../app.js')

describe("GET /api/clientes", () => {
  it("devolver todos los registros de la tabla clientes", async () => {
    const res = await supertest.agent(app).get("/api/clientes");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          Cuil: expect.any(Number),
          Nombre: expect.any(String),
          Barrio: expect.any(String),
          Fecha_nacimiento: expect.any(String)
        }),
      ])
    );
  });
});

describe("GET /api/clientes/:cuil", () => {
  it("devolver el cliente con el cuil 20058549653", async () => {
      const res = await supertest.agent(app).get("/api/clientes/20058549653");
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(
          expect.objectContaining({
              Cuil: expect.any(Number)
          })
      );
  });
});

describe("GET /api/clientes/:cuil", () => {
  it("devolver status 404, el cliente con el cuil 1 no existe", async () => {
      const res = await supertest.agent(app).get("/api/clientes/1");
      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual(
          expect.objectContaining({
            error: expect.any(String)
          })
      );
  });
});

const cliente= {
  "cuil": 20222223562,
  "nombre": "Marcelo Lopez",
  "barrio": "Barrio Suarez",
  "fecha_nacimiento": "1995-02-09" 
}

describe("POST /api/clientes/", () => {
  it("crear el cliente con el cuil 20222223562", async () => {
      const res = await supertest.agent(app).post("/api/clientes").send(cliente);
      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual(
          expect.objectContaining({
            Cuil: expect.any(Number),
            Nombre: expect.any(String),
            Barrio: expect.any(String),
            Fecha_nacimiento: expect.any(String)
          })
      );
  });
});

const modificar = {
    "nombre": "Marcelo Gonzales",
    "barrio": "Barrio Suarez",
    "fecha_nac": "2000-05-05"
}

describe("PUT /api/clientes/:cuil", () => {
  it("modificar el cliente con el cuil 20058549653", async () => {
      const res = await supertest.agent(app).put("/api/clientes/20058549653").send(modificar);
      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual(
          expect.objectContaining({
            Cuil: expect.any(Number),
            Nombre: expect.any(String),
            Barrio: expect.any(String),
            Fecha_nacimiento: expect.any(String)
          })
      );
  });
});

describe("PUT /api/clientes/:cuil", () => {
  it("devuelve status 404 al querer modificar el cliente con el cuil 1 que no existe", async () => {
      const res = await supertest.agent(app).put("/api/clientes/1").send(modificar);
      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual(
          expect.objectContaining({
            error: expect.any(String)
          })
      );
  });
});

describe("DELETE /api/clientes/:cuil", () => {
  it("devuelve el cliente eliminado con el cuil 20222223562", async () => {
      const res = await supertest.agent(app).delete("/api/clientes/20222223562");
      expect(res.statusCode).toEqual(202);
      expect(res.body).toEqual(
          expect.objectContaining({
            Cuil: expect.any(Number),
            Nombre: expect.any(String),
            Barrio: expect.any(String),
            Fecha_nacimiento: expect.any(String)
          })
      );
  });
});

describe("DELETE /api/clientes/:cuil", () => {
  it("devuelve status 404 al querer eliminar el cliente con el cuil 1", async () => {
      const res = await supertest.agent(app).delete("/api/clientes/1");
      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual(
          expect.objectContaining({
            error: expect.any(String)
          })
      );
  });
});


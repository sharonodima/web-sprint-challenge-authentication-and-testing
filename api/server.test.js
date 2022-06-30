// Write your tests here
const request = require("supertest");
const assert = require("assert");
const server = require("./server");
const knex = require("../data/dbConfig")

beforeAll(async () => {
  await knex.migrate.up()
  await knex.seed.run()
})

describe("Register", () => {
  test("Create new user", (done) => {
    request(server).post("/api/auth/register").send({
      username: "Stewie",
      password: "12345"
    })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        assert(response.body.username, 'Stewie');
        done();
      });
  });

  test("Using existing username", (done) => {
    request(server).post("/api/auth/register").send({
      username: "Stewie",
      password: "12345"
    })
      .expect(400)
      .then(response => {
        assert(response.body, 'username taken');
        done();
      });
  });
});

let token;
describe("Login", () => {
  test("Login existing user", (done) => {
    request(server).post("/api/auth/login").send({
      username: "Stewie",
      password: "12345"
    })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        assert(response.body.message, 'welcome, Stewie');
        token = response.body.token;
        done();
      });
  });

  test("Login using invalid username", (done) => {
    request(server).post("/api/auth/login").send({
      username: "Mark",
      password: "12345"
    })
      .expect(400)
      .then(response => {
        assert(response.body, 'invalid credentials');
        done();
      });
  });
});

describe("Jokes", () => {
  test("Successfully get jokes", (done) => {
    request(server).get("/api/jokes")
      .set("Authorization", token)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        assert(response.body.length, 3);
        done();
      });
  });

  test("Sending bad authorization", (done) => {
    request(server).get("/api/jokes")
      .set("Authorization", "Markymark")
      .expect(403)
      .then(response => {
        assert(response.body, 'token invalid');

        done();
      });
  });
});

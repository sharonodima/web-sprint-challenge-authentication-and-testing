// Write your tests here
const request = require("supertest")
const assert = require("assert")
const server = require("./server")

describe("Register",() => {
  test("Create new user", (done) => {
    request(server).post("/api/auth/register").send({
      username: "Stewie",
      password: "12345"
    })
    .expect(200)
    .expect('Content-Type', /json/)
    .then(response => {
      assert(response.body.username, 'Stewie')
      done();
  })
  })
})

describe("Login",() => {
  test("Login user", (done) => {
    request(server).post("/api/auth/login").send({
      username: "Stewie",
      password: "12345"
    })
    .expect(200)
    .expect('Content-Type', /json/)
    .then(response => {
      assert(response.body.username, 'Stewie')
      done();
  })
  })
})
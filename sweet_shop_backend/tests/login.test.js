const request = require("supertest");
const app = require("../app"); // Your Express app

describe("POST /api/auth/login", () => {
  // TC01: Successful login
  it("should login successfully with valid credentials", async () => {
    const response = await request(app).post("/api/auth/login").send({
      username: "ray@example.com",
      password: "securePass123",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Login successful",
      "token"
    ); // assuming JWT or similar token
  });

  // TC02: Invalid password
  it("should fail login with invalid password", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ username: "ray@example.com", password: "wrongPassword" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid credentials");
  });

  // TC03: User not found
  it("should fail login for non-existent user", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ username: "unknownUser@example.com", password: "anyPassword" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("User not found");
  });

  // TC04: Empty username/email
  it("should fail login if username/email is empty", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ username: "", password: "somePassword" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Required fields missing");
  });
});

const request = require("supertest");
const app = require("../app"); // Adjust path as needed

describe("POST /api/auth/register", () => {
  // Test 1: Successful registration
  it("should register a new user with valid data", async () => {
    const response = await request(app).post("/api/auth/register").send({
      username: "sam@example.com",
      email: "sam@example.com",
      password: "securePass123",
      address: "Ahmedabad",
      created_by: "ADMIN",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("message", "User registered");
  });

  // Test 2: Duplicate email or username
  it("should fail when email or username already exists", async () => {
    // Register once to ensure user exists
    await request(app).post("/api/auth/register").send({
      username: "bob@example.com",
      email: "bob@example.com",
      password: "securePass123",
      address: "Mumbai",
      created_by: "ADMIN",
    });

    // Attempt duplicate registration
    const response = await request(app).post("/api/auth/register").send({
      username: "bob@example.com", // same username
      email: "bob@example.com", // same email
      password: "newPass456",
      address: "Pune",
      created_by: "ADMIN",
    });

    expect(response.statusCode).toBe(400); // or 409 if your controller uses that
    expect(response.body).toHaveProperty("message", "Email or username exists");
  });

  // Test 3: Missing required fields
  it("should fail when required fields are missing", async () => {
    const response = await request(app).post("/api/auth/register").send({
      email: "",
      password: "",
      username: "",
      address: "",
      created_by: "",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("message", "Required fields missing");
  });
});

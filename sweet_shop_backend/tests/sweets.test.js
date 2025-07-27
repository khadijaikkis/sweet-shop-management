const request = require("supertest");
const app = require("../app"); // adjust if needed
const jwt = require("jsonwebtoken");
const db = require("../db/dbConfig");

// Helper to create test tokens
const userToken = jwt.sign({ id: 1, role: "user" }, process.env.JWT_SECRET);
const adminToken = jwt.sign({ id: 2, role: "admin" }, process.env.JWT_SECRET);

let createdSweetId;

describe("Sweet CRUD + Search Tests", () => {
  afterAll((done) => {
    // Clean up and close DB
    if (createdSweetId) {
      db.query("DELETE FROM sweets WHERE id = ?", [createdSweetId], () => {
        db.end();
        done();
      });
    } else {
      db.end();
      done();
    }
  });

  it("should list all sweets", async () => {
    const res = await request(app)
      .get("/api/sweets")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should create a new sweet (admin only)", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Kaju Katli",
        category: "Dry Fruit",
        price: 200,
        quantity_in_stock: 10,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message", "Sweet created successfully");
    createdSweetId = res.body.sweetId;
  });

  it("should fail to create sweet with missing name", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ price: 100 });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch("Name and price are required");
  });

  it("should update an existing sweet", async () => {
    const res = await request(app)
      .put(`/api/sweets/${createdSweetId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Kaju Katli",
        category: "Dry Fruit",
        price: 220,
        quantity_in_stock: 15,
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Sweet updated successfully");
  });

  it("should return 404 for invalid sweet ID", async () => {
    const res = await request(app)
      .put(`/api/sweets/invalidID123`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ price: 75 });

    expect(res.status).toBe(404);
  });

  it("should delete an existing sweet", async () => {
    const res = await request(app)
      .delete(`/api/sweets/${createdSweetId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Sweet deleted successfully");

    createdSweetId = null; // already deleted
  });

  it("should return 404 on deleting non-existent sweet", async () => {
    const res = await request(app)
      .delete(`/api/sweets/invalidSweetId`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
  });

  it("should search sweets by name", async () => {
    const res = await request(app)
      .get("/api/sweets/search?name=Kaju")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

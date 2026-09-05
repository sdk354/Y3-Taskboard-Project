import request from "supertest";
import app from "../app.js";
import { connectTestDb, clearTestDb, closeTestDb } from "./setup/db.js";

beforeAll(async () => {
  await connectTestDb();
});

afterAll(async () => {
  await closeTestDb();
});

beforeEach(async () => {
  await clearTestDb();
});

const demoUser = {
  username: "sam",
  email: "sam@example.com",
  password: "password123",
};

async function register(overrides = {}) {
  return request(app)
    .post("/api/auth/register")
    .send({ ...demoUser, ...overrides });
}

describe("POST /api/auth/register", () => {
  it("creates a user and returns it without the password", async () => {
    const res = await register();

    expect(res.status).toBe(201);
    expect(res.body.data).toMatchObject({
      username: demoUser.username,
      email: demoUser.email,
    });
    expect(res.body.data.passwordHash).toBeUndefined();
    expect(res.body.data.password).toBeUndefined();
  });

  it("rejects a password shorter than 6 characters", async () => {
    const res = await register({ password: "abc" });

    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: "password" })]),
    );
  });

  it("rejects a duplicate username", async () => {
    await register();
    const res = await register({ email: "other@example.com" });

    expect(res.status).toBe(400);
    expect(res.body.errors[0]).toMatchObject({ field: "username" });
  });

  it("rejects a duplicate email", async () => {
    await register();
    const res = await register({ username: "someoneelse" });

    expect(res.status).toBe(400);
    expect(res.body.errors[0]).toMatchObject({ field: "email" });
  });
});

describe("POST /api/auth/login", () => {
  beforeEach(async () => {
    await register();
  });

  it("returns a token for valid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: demoUser.username, password: demoUser.password });

    expect(res.status).toBe(200);
    expect(typeof res.body.data.token).toBe("string");
  });

  it("rejects an unknown username", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "nobody", password: "whatever" });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Invalid credentials");
  });

  it("rejects the wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: demoUser.username, password: "wrongpassword" });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Invalid credentials");
  });
});

describe("GET /api/auth/me", () => {
  it("returns 401 without a token", async () => {
    const res = await request(app).get("/api/auth/me");

    expect(res.status).toBe(401);
  });

  it("returns the current user for a valid token", async () => {
    await register();
    const login = await request(app)
      .post("/api/auth/login")
      .send({ username: demoUser.username, password: demoUser.password });
    const token = login.body.data.token;

    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({
      username: demoUser.username,
      email: demoUser.email,
    });
  });
});

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

async function authHeader() {
  await request(app).post("/api/auth/register").send({
    username: "sam",
    email: "sam@example.com",
    password: "password123",
  });

  const login = await request(app)
    .post("/api/auth/login")
    .send({ username: "sam", password: "password123" });

  return { Authorization: `Bearer ${login.body.data.token}` };
}

async function createTask(auth, overrides = {}) {
  return request(app)
    .post("/api/tasks")
    .set(auth)
    .send({
      title: "Write tests",
      type: "task",
      dueDate: "2026-12-01",
      ...overrides,
    });
}

describe("GET /api/tasks", () => {
  it("returns 401 without a token", async () => {
    const res = await request(app).get("/api/tasks");

    expect(res.status).toBe(401);
  });

  it("lists tasks for an authenticated user", async () => {
    const auth = await authHeader();
    await createTask(auth);

    const res = await request(app).get("/api/tasks").set(auth);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe("Write tests");
  });
});

describe("POST /api/tasks", () => {
  it("creates a task with version 0", async () => {
    const auth = await authHeader();
    const res = await createTask(auth);

    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Write tests");
    expect(res.body.status).toBe("To Do");
    expect(res.body.version).toBe(0);
  });

  it("rejects a title shorter than 3 characters", async () => {
    const auth = await authHeader();
    const res = await createTask(auth, { title: "ab" });

    expect(res.status).toBe(400);
  });

  it("rejects an invalid type", async () => {
    const auth = await authHeader();
    const res = await createTask(auth, { type: "epic" });

    expect(res.status).toBe(400);
  });
});

describe("PATCH /api/tasks/:id — optimistic concurrency", () => {
  it("updates the task and advances its version when the version matches", async () => {
    const auth = await authHeader();
    const created = await createTask(auth);

    const res = await request(app)
      .patch(`/api/tasks/${created.body._id}`)
      .set(auth)
      .send({ status: "In Progress", version: 0 });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("In Progress");
    expect(res.body.version).toBe(1);
  });

  it("rejects an update with a stale version with 409", async () => {
    const auth = await authHeader();
    const created = await createTask(auth);
    const id = created.body._id;

    // first update succeeds and moves the task to version 1
    await request(app)
      .patch(`/api/tasks/${id}`)
      .set(auth)
      .send({ status: "In Progress", version: 0 });

    // a second client still holding version 0 tries to update
    const res = await request(app)
      .patch(`/api/tasks/${id}`)
      .set(auth)
      .send({ status: "Done", version: 0 });

    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/modified by another user/i);
  });

  it("requires a version to update at all", async () => {
    const auth = await authHeader();
    const created = await createTask(auth);

    const res = await request(app)
      .patch(`/api/tasks/${created.body._id}`)
      .set(auth)
      .send({ status: "In Progress" });

    expect(res.status).toBe(400);
  });
});

describe("DELETE /api/tasks/:id", () => {
  it("deletes an existing task", async () => {
    const auth = await authHeader();
    const created = await createTask(auth);

    const res = await request(app)
      .delete(`/api/tasks/${created.body._id}`)
      .set(auth);

    expect(res.status).toBe(200);

    const list = await request(app).get("/api/tasks").set(auth);
    expect(list.body).toHaveLength(0);
  });

  it("returns 404 for a task that does not exist", async () => {
    const auth = await authHeader();

    const res = await request(app)
      .delete("/api/tasks/000000000000000000000000")
      .set(auth);

    expect(res.status).toBe(404);
  });
});

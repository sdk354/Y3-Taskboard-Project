import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../config/database.js";
import User from "../models/User.js";
import Task from "../models/Task.js";
import { hashPassword } from "../utils/hash.js";
import mockTasks from "../utils/mockTasks.js";

const demoUsers = [
  { username: "samdoe", email: "sam@example.com", password: "password123" },
  { username: "ivysmith", email: "ivy@example.com", password: "password123" },
  { username: "ryanvance", email: "ryan@example.com", password: "password123" },
];

const seedUsers = async () => {
  let created = 0;

  for (const user of demoUsers) {
    const exists = await User.findOne({ username: user.username });

    if (exists) continue;

    const passwordHash = await hashPassword(user.password);

    await User.create({
      username: user.username,
      email: user.email,
      passwordHash,
    });

    created += 1;
  }

  return created;
};

const seedTasks = async () => {
  let created = 0;

  for (const task of mockTasks) {
    const exists = await Task.findOne({ id: task.id });

    if (exists) continue;

    await Task.create({ ...task, version: 0 });
    created += 1;
  }

  return created;
};

// tasks written before the version field existed shouldn't be treated
// as permanently conflicted - backfill them to version 0
const backfillVersions = async () => {
  const result = await Task.updateMany(
    { version: { $exists: false } },
    { $set: { version: 0 } },
  );

  return result.modifiedCount;
};

const run = async () => {
  await connectDB();

  const usersCreated = await seedUsers();
  const tasksCreated = await seedTasks();
  const backfilled = await backfillVersions();

  console.log(
    `seed complete: ${usersCreated} users created, ${tasksCreated} tasks created, ${backfilled} legacy tasks backfilled to version 0`,
  );

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error("seed failed:", err.message);
  process.exit(1);
});

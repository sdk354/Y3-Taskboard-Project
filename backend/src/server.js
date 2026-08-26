import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`api up on http://localhost:${port}`);
});

connectDB().catch((err) => {
  console.error("failed to connect to MongoDB:", err.message);
});

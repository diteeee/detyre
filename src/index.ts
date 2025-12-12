import express from "express";
import { MongoClient } from "mongodb";

const app = express();
app.use(express.json());

const uri = process.env.MONGO_URI || "mongodb://localhost:27017/";
const client = new MongoClient(uri);

async function start() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    app.get("/", (_req, res) => {
      res.send("Hello World!");
    });
    // e bona _req since it is never used to silence warnings (usually se kishim shkrujt qashtu)

    app.listen(3000, () => console.log("Server running on port 3000"));
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
}

start();

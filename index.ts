import express, { Request, Response } from "express";
import { MongoClient } from "mongodb";

import userRouter from "./routes/users";

const app = express();
app.use(express.json());

const uri: string = process.env.MONGO_URI || "mongodb://mongo:27017/detyre";
const client: MongoClient = new MongoClient(uri);

async function start(): Promise<void> {
  try {
    await client.connect();
    const db = client.db("detyre");
    app.locals.db = db;

    console.log("Connected to MongoDB");

    app.get("/", (_req: Request, res: Response) => {
      res.send("Hello World!");
    });

    app.use("/users", userRouter);

    app.listen(3000, () => console.log("Server running on port 3000"));
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
}

start();

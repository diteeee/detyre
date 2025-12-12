import express, { Request, Response } from "express";
import { MongoClient, Db } from "mongodb";

const app = express();
app.use(express.json());

const uri: string = process.env.MONGO_URI || "mongodb://mongo:27017/detyre";
const client: MongoClient = new MongoClient(uri);

async function start(): Promise<void> {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    app.get("/", (_req: Request, res: Response) => {
      res.send("Hello World!");
    });
    // e bona _req since it is never used to silence warnings (usually se kishim shkrujt qashtu)

    app.listen(3000, () => console.log("Server running on port 3000"));
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
}

start();

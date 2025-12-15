"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const bcrypt_1 = __importDefault(require("bcrypt"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const uri = process.env.MONGO_URI || "mongodb://mongo:27017/detyre";
const client = new mongodb_1.MongoClient(uri);
async function start() {
  try {
    await client.connect();
    const db = client.db("detyre");
    app.locals.db = db;
    console.log("Connected to MongoDB");
    app.get("/", (_req, res) => {
      res.send("Hello World!");
    });

    app.post("/register", async (req, res) => {
      const { email, password, role = "user" } = req.body;
      try {
        const users = req.app.locals.db.collection("users");
        const existing = await users.findOne({ email });
        if (existing)
          return res.status(400).json({ message: "User already exists" });
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        await users.insertOne({ email, password: hashedPassword, role });
        res.json({ message: "User created" });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating user" });
      }
    });
    app.listen(3000, () => console.log("Server running on port 3000"));
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
}
start();

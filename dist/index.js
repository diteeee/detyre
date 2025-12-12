"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const uri = "mongodb://localhost:27017/";
const client = new mongodb_1.MongoClient(uri);
async function start() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        app.get("/", (_req, res) => {
            res.send("Hello World!");
        });
        // e bona _req since it is never used to silence warnings (usually se kishim shkrujt qashtu)
        app.listen(3000, () => console.log("Server running on port 3000"));
    }
    catch (err) {
        console.error("Failed to connect to MongoDB", err);
    }
}
start();

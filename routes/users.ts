import { Router, Response } from "express";
import { ObjectId, Db, Collection } from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthRequest, auth, checkRole } from "../middleware/auth";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "secret";

const getUsersCollection = (db: Db): Collection => db.collection("users");

router.get("/profile", auth, async (req: AuthRequest, res: Response) => {
  try {
    const db = req.app.locals.db as Db;
    const users = getUsersCollection(db);

    const userID = req.user?.userID;
    if (!userID) return res.status(401).json({ message: "User ID missing" });

    const user = await users.findOne(
      { _id: new ObjectId(userID) },
      { projection: { password: 0 } }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

router.get(
  "/all",
  auth,
  checkRole(["admin"]),
  async (req: AuthRequest, res: Response) => {
    try {
      const db = req.app.locals.db as Db;
      const users = getUsersCollection(db);

      const allUsers = await users
        .find({}, { projection: { password: 0 } })
        .toArray();

      res.json({ success: true, users: allUsers });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching all users" });
    }
  }
);

router.post("/signin", async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;
    const db = req.app.locals.db as Db;
    const users = getUsersCollection(db);

    const user = await users.findOne({ email });
    if (!user)
      return res.status(400).json({ success: false, message: "No user found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Password does not match" });

    const token = jwt.sign(
      { role: user.role, email: user.email, userID: user._id.toString() },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({ success: true, token, user: { ...user, password: undefined } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Sign-in error" });
  }
});

router.post("/register", async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, role = "user" } = req.body;
    const db = req.app.locals.db as Db;
    const users = getUsersCollection(db);

    const existing = await users.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await users.insertOne({
      email,
      password: hashedPassword,
      role,
    });

    res.json({ message: "User created", userId: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating user" });
  }
});

export default router;

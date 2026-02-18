import { RequestHandler } from "express";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

type StoredUser = {
  id: string;
  username: string;
  fullName: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
};

type PublicUser = {
  id: string;
  username: string;
  fullName: string;
  email: string;
  createdAt: string;
};

const usersFilePath = path.join(import.meta.dirname, "../data/users.json");

let writeQueue: Promise<void> = Promise.resolve();

async function ensureUsersFile() {
  await fs.mkdir(path.dirname(usersFilePath), { recursive: true });
  try {
    await fs.access(usersFilePath);
  } catch {
    await fs.writeFile(usersFilePath, "[]\n", "utf8");
  }
}

async function readUsers(): Promise<StoredUser[]> {
  await ensureUsersFile();
  const raw = await fs.readFile(usersFilePath, "utf8");
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? (parsed as StoredUser[]) : [];
}

async function writeUsers(users: StoredUser[]) {
  await ensureUsersFile();
  writeQueue = writeQueue.then(async () => {
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2) + "\n", "utf8");
  });
  await writeQueue;
}

function toPublicUser(u: StoredUser): PublicUser {
  return {
    id: u.id,
    username: u.username,
    fullName: u.fullName,
    email: u.email,
    createdAt: u.createdAt,
  };
}

function hashPassword(password: string, salt: string) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return hash;
}

export const handleRegister: RequestHandler = async (req, res) => {
  const { username, fullName, email, password } = req.body ?? {};

  if (!username || !fullName || !email || !password) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  const users = await readUsers();

  if (users.some((u) => u.email.toLowerCase() === String(email).toLowerCase())) {
    return res.status(409).json({ success: false, message: "Email already registered" });
  }

  if (users.some((u) => u.username.toLowerCase() === String(username).toLowerCase())) {
    return res.status(409).json({ success: false, message: "Username already taken" });
  }

  const passwordSalt = crypto.randomBytes(16).toString("hex");
  const passwordHash = hashPassword(String(password), passwordSalt);

  const newUser: StoredUser = {
    id: crypto.randomUUID(),
    username: String(username),
    fullName: String(fullName),
    email: String(email),
    passwordHash,
    passwordSalt,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  await writeUsers(users);

  return res.status(201).json({ success: true, message: "Account created successfully", user: toPublicUser(newUser) });
};

export const handleLogin: RequestHandler = async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Missing email or password" });
  }

  const users = await readUsers();
  const user = users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());

  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }

  const attemptedHash = hashPassword(String(password), user.passwordSalt);
  if (attemptedHash !== user.passwordHash) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }

  return res.status(200).json({ success: true, message: "Login successful", user: toPublicUser(user) });
};

export const handleGetUserById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const users = await readUsers();
  const user = users.find((u) => u.id === id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  return res.status(200).json({ success: true, user: toPublicUser(user) });
};

export const handleUpdateUser: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { username, fullName, email } = req.body ?? {};

  const users = await readUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return res.status(404).json({ success: false, message: "User not found" });

  if (email && users.some((u) => u.id !== id && u.email.toLowerCase() === String(email).toLowerCase())) {
    return res.status(409).json({ success: false, message: "Email already registered" });
  }

  if (username && users.some((u) => u.id !== id && u.username.toLowerCase() === String(username).toLowerCase())) {
    return res.status(409).json({ success: false, message: "Username already taken" });
  }

  users[idx] = {
    ...users[idx],
    username: username ? String(username) : users[idx].username,
    fullName: fullName ? String(fullName) : users[idx].fullName,
    email: email ? String(email) : users[idx].email,
  };

  await writeUsers(users);

  return res.status(200).json({ success: true, message: "Profile updated successfully", user: toPublicUser(users[idx]) });
};

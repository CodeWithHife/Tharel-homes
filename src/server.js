const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

const users = [];
const tokenStore = new Map();

app.post("/api/auth/signup", (req, res) => {
  const { firstName, lastName, email, password, role } = req.body || {};

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "Please provide your full details." });
  }

  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(409).json({ message: "Email already registered." });
  }

  const user = {
    id: `${Date.now()}`,
    firstName,
    lastName,
    email,
    role: role || "buyer",
    onboardingDone: false,
  };

  users.push({ ...user, password });

  const token = `auth-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  tokenStore.set(token, user.id);
  res.status(201).json({ message: "Signup successful", token, user });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const user = users.find((entry) => entry.email === email && entry.password === password);
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const token = `auth-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  tokenStore.set(token, user.id);
  res.json({ message: "Login successful", token, user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, onboardingDone: user.onboardingDone } });
});

app.get("/api/auth/me", (req, res) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) {
    return res.status(401).json({ message: "Missing auth token." });
  }

  const userId = tokenStore.get(token);
  const user = users.find((entry) => entry.id === userId);
  if (!user) {
    return res.status(401).json({ message: "Invalid token." });
  }

  res.json({ user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, onboardingDone: user.onboardingDone } });
});

app.listen(PORT, () => {
  console.log(`Auth server running on http://localhost:${PORT}`);
});

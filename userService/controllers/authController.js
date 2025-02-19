// POST /api/auth/register
// POST /api/auth/login

const { registerUser, loginUser } = require("../services/authService");

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const { user, token } = await registerUser(username, email, password);
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser(email, password);
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = { register, login };

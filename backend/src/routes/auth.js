import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { jwtAuth } from '../middleware/jwtAuth.js';
import { validateLogin, validateRegister } from '../middleware/validateAuth.js';
import { signToken } from '../utils/token.js';
import { resolveRole } from '../utils/admin.js';

const router = Router();

function toUserResponse(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role ?? 'user',
    createdAt: user.createdAt,
  };
}

async function syncAdminRole(user) {
  const role = resolveRole(user.email);
  if (role === 'admin' && user.role !== 'admin') {
    user.role = 'admin';
    await user.save();
  }
  return user;
}

router.post('/register', validateRegister, async (req, res) => {
  try {
    const { name, email, password } = req.validatedAuth;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      passwordHash,
      role: resolveRole(email),
    });
    const token = signToken(user._id.toString());

    return res.status(201).json({
      message: 'Registration successful',
      data: {
        token,
        user: toUserResponse(user),
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.validatedAuth;

    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    await syncAdminRole(user);
    const token = signToken(user._id.toString());

    return res.status(200).json({
      message: 'Login successful',
      data: {
        token,
        user: toUserResponse(user),
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/me', jwtAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await syncAdminRole(user);

    return res.status(200).json({
      message: 'User fetched successfully',
      data: toUserResponse(user),
    });
  } catch (error) {
    console.error('Me error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;

import { User } from '../models/User.js';
import { verifyToken } from '../utils/token.js';

export async function jwtAuth(req, res, next) {
  const authHeader = req.header('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.slice(7);

  try {
    const payload = verifyToken(token);
    const user = await User.findById(payload.sub).select('name email role');

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

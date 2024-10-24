// src/utils/authMiddleware.ts
import { NextApiRequest, NextApiResponse } from 'next';

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
const authMiddleware = (req: NextApiRequest, res: NextApiResponse, next: Function) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

export default authMiddleware;

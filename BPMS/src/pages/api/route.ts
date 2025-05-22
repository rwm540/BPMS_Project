// pages/api/sales.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../lib/mongodb';
import Sale from '../../../models/Sale';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const sales = await Sale.find({});
      res.status(200).json(sales);
    } catch (error) {
      res.status(500).json({ error: 'مشکل در گرفتن داده‌ها' });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// models/Sale.ts
import mongoose from 'mongoose';

const SaleSchema = new mongoose.Schema({
  productName: String,
  quantity: Number,
  revenue: Number,
  saleDate: String,
});

const Sale = mongoose.models.Sale || mongoose.model('Sale', SaleSchema);
export default Sale;
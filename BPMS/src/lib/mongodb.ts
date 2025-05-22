import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.DATABASE_URL_Mongodb!, {
    dbName: 'ERP', // چون تو Mongo Compass دیتابیس ERP بود
  });
  console.log('✅ MongoDB Connected');
};

export default connectDB;
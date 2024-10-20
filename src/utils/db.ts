import mongoose from 'mongoose';

const connectToDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/signa-pro-pay';
  try {
    await mongoose.connect(mongoURI, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

export default connectToDB;

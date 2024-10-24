import mongoose from 'mongoose';

const connectToDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/signa-pro-pay';
  console.log('Attempting to connect to MongoDB at:', mongoURI);

  let retries = 5;
  while (retries) {
    try {
      await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 30000,
      } as any);
      console.log('Connected to MongoDB');
      break; // Exit loop if successful
    } catch (err) {
      console.error('MongoDB connection error:', err);
      retries -= 1;
      console.log(`Retrying in 5 seconds... (${retries} retries left)`);
      await new Promise((res) => setTimeout(res, 5000)); // Wait 5 seconds before retrying
    }
  }

  if (!retries) {
    console.error('Failed to connect to MongoDB after multiple attempts.');
  }
};

export default connectToDB;

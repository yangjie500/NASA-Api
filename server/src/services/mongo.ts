import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config()

// MongoDB password: pkdxQld4opmtvqng
const MONGO_URL = process.env.MONGO_URL!;

// Event Emitter - .once() means the event emitter will only be triggered once
mongoose.connection.once('open', () => {
  console.log('MongoDB connection ready!');
})

mongoose.connection.on('error', (err) => {
  console.error(err);
})

async function mongoConnect() {
  // Connect to database before listening: Returns Promise
  await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

export {
  mongoConnect,
  mongoDisconnect
}
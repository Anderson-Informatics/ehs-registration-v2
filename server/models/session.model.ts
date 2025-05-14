import mongoose from 'mongoose';

const schema: mongoose.Schema = new mongoose.Schema({
  _id: String,
  proctor: String,
  phone: String,
  room: String,
  wing: String,
  date: String,
  start: String,
  end: String,
  duration: Number,
  students: Array,
});

// session model
export default mongoose.model('Session', schema);

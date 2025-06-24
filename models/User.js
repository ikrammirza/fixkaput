import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  otp: { type: String },
  otpExpires: { type: Date },
  name: { type: String },
  address: {
    area: { type: String },
    line1: { type: String },
    city: { type: String },
    pincode: { type: String },
  }
}, { timestamps: true, collection: 'users' });
const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
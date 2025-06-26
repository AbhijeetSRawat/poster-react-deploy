import mongoose from 'mongoose';

const referalSchema = new mongoose.Schema({
  referalCode: {
    type: String,
    required: true,
    unique: true
  }
}, { timestamps: true });

const Referal = mongoose.model('Referal', referalSchema);
export default Referal;

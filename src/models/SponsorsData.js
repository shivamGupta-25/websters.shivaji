import mongoose from 'mongoose';

const SponsorSchema = new mongoose.Schema({
  id: String,
  name: String,
  img: String,
  website: String,
  category: { type: String, default: 'general' }, // general, gold, silver, etc.
  priority: { type: Number, default: 0 }  // For ordering sponsors
}, { _id: false });

const SponsorsDataSchema = new mongoose.Schema({
  sponsors: [SponsorSchema],
  categories: {
    type: Map,
    of: String
  },
  uiContent: {
    title: String,
    subtitle: String,
    description: String,
    showSection: { type: Boolean, default: true }
  }
}, { timestamps: true });

// Create model if it doesn't exist already
export default mongoose.models.SponsorsData || mongoose.model('SponsorsData', SponsorsDataSchema); 
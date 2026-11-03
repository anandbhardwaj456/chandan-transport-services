import mongoose, { Document, Schema } from 'mongoose';

export interface IWebsiteSettings extends Document {
  key: string;
  businessName: string;
  location: string;
  heroTitle: string;
  heroDescription: string;
  serviceLocationLabel: string;
  aboutIntroduction: string;
  phoneNumbers: string[];
  email: string;
  website: string;
  whatsappNumber: string;
  contactVerified: boolean;
  contentVerified: boolean;
}

const websiteSettingsSchema = new Schema<IWebsiteSettings>({
  key: { type: String, default: 'primary', unique: true },
  businessName: { type: String, default: 'Chandan Transportation Services', trim: true },
  location: { type: String, default: 'Jamshedpur, Jharkhand, India', trim: true },
  heroTitle: { type: String, default: '', trim: true },
  heroDescription: { type: String, default: '', trim: true },
  serviceLocationLabel: { type: String, default: '', trim: true },
  aboutIntroduction: { type: String, default: '', trim: true },
  phoneNumbers: [{ type: String, trim: true }],
  email: { type: String, default: '', trim: true, lowercase: true },
  website: { type: String, default: '', trim: true },
  whatsappNumber: { type: String, default: '', trim: true },
  contactVerified: { type: Boolean, default: false },
  contentVerified: { type: Boolean, default: false },
}, { timestamps: true });

const WebsiteSettings = mongoose.model<IWebsiteSettings>('WebsiteSettings', websiteSettingsSchema);

export default WebsiteSettings;

// Script to migrate data from JS files to MongoDB
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Initialize environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import site content and techelons data
let siteContent, techelonsData;

async function importData() {
  try {
    // For SiteContent
    const siteContentModule = await import('../app/data/siteContent.js');
    siteContent = siteContentModule.default;

    // For TechelonsData
    const techelonsDataModule = await import('../app/data/techelonsData.js');
    techelonsData = {
      festInfo: techelonsDataModule.festInfo,
      eventCategories: techelonsDataModule.eventCategories,
      registrationStatus: techelonsDataModule.registrationStatus,
      festDays: techelonsDataModule.festDays,
      EVENT_IMAGES: techelonsDataModule.EVENT_IMAGES,
      whatsappGroups: techelonsDataModule.whatsappGroups,
      events: techelonsDataModule.events,
      uiContent: techelonsDataModule.uiContent
    };

    console.log('Data files imported successfully');
    return true;
  } catch (error) {
    console.error('Error importing data files:', error);
    return false;
  }
}

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env file');
  process.exit(1);
}

async function connectToMongoDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4
    });
    console.log('Connected to MongoDB successfully');
    return true;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    return false;
  }
}

// Define schemas for models
const defineSiteContentSchema = () => {
  // Banner schema
  const BannerSchema = new mongoose.Schema({
    title: String,
    subtitle: String,
    institution: String,
    description: String,
    buttonText: String,
    buttonLink: String,
    logoImage: String
  }, { _id: false });

  // Paragraph schema
  const ParagraphSchema = new mongoose.Schema({
    id: Number,
    content: String
  }, { _id: false });

  // About schema
  const AboutSchema = new mongoose.Schema({
    title: String,
    paragraphs: [ParagraphSchema]
  }, { _id: false });

  // Council member schema
  const CouncilMemberSchema = new mongoose.Schema({
    name: String,
    role: String,
    image: String,
    linkedin: String
  }, { _id: false });

  // Council schema
  const CouncilSchema = new mongoose.Schema({
    title: String,
    description: String,
    members: [CouncilMemberSchema]
  }, { _id: false });

  // Event schema
  const EventSchema = new mongoose.Schema({
    title: String,
    imageUrl: String
  }, { _id: false });

  // Past events schema
  const PastEventsSchema = new mongoose.Schema({
    title: String,
    description: String,
    events: [EventSchema]
  }, { _id: false });

  // Footer schema
  const FooterSchema = new mongoose.Schema({
    email: String,
    socialLinks: [{
      id: String,
      url: String,
      icon: String,
      hoverClass: String
    }],
    logoImage: String
  }, { _id: false });

  // Workshop detail schema
  const WorkshopDetailSchema = new mongoose.Schema({
    label: String,
    value: String,
    id: String
  }, { _id: false });

  // Workshop social media schema
  const WorkshopSocialMediaSchema = new mongoose.Schema({
    instagram: String,
    linkedin: String
  }, { _id: false });

  // Workshop email notification schema
  const WorkshopEmailNotificationSchema = new mongoose.Schema({
    subject: String
  }, { _id: false });

  // Workshop schema
  const WorkshopSchema = new mongoose.Schema({
    title: String,
    shortDescription: String,
    isRegistrationOpen: Boolean,
    formSubmittedLink: String,
    details: [WorkshopDetailSchema],
    bannerImage: String,
    whatsappGroupLink: String,
    socialMedia: WorkshopSocialMediaSchema,
    emailNotification: WorkshopEmailNotificationSchema
  }, { _id: false });

  // Main SiteContent schema
  const SiteContentSchema = new mongoose.Schema({
    banner: BannerSchema,
    about: AboutSchema,
    council: CouncilSchema,
    pastEvents: PastEventsSchema,
    footer: FooterSchema,
    workshop: WorkshopSchema
  }, { timestamps: true });

  // Return the model
  return mongoose.models.SiteContent || mongoose.model('SiteContent', SiteContentSchema);
};

const defineTechelonsDataSchema = () => {
  // Define schemas for nested objects
  const FestInfoDatesSchema = new mongoose.Schema({
    day1: String,
    day2: String,
    registrationDeadline: String
  }, { _id: false });

  const FestInfoSchema = new mongoose.Schema({
    registrationEnabled: Boolean,
    dates: FestInfoDatesSchema
  }, { _id: false });

  const TeamSizeSchema = new mongoose.Schema({
    min: Number,
    max: Number
  }, { _id: false });

  const PrizeSchema = new mongoose.Schema({
    position: String,
    reward: String
  }, { _id: false });

  const CoordinatorSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String
  }, { _id: false });

  const EventSchema = new mongoose.Schema({
    id: String,
    featured: { type: Boolean, default: false },
    image: String,
    name: String,
    tagline: String,
    shortDescription: String,
    description: String,
    category: String,
    speaker: String,
    teamSize: TeamSizeSchema,
    venue: String,
    festDay: String,
    date: String,
    time: String,
    duration: String,
    registrationStatus: String,
    prizes: [PrizeSchema],
    coordinators: [CoordinatorSchema],
    rules: [String],
    instructions: String,
    resources: String,
    whatsappGroup: String,
    competitionStructure: [String],
    evaluationCriteria: [String]
  }, { _id: false });

  // Feature schema for UI content
  const FeatureSchema = new mongoose.Schema({
    title: String,
    icon: String,
    description: String
  }, { _id: false });

  // UI Content schema for TechelonsMain component
  const UIContentSchema = new mongoose.Schema({
    title: String,
    subtitle: String,
    festDate: String,
    aboutTitle: String,
    aboutParagraphs: [String],
    exploreTitle: String,
    exploreDescription: String,
    features: [FeatureSchema]
  }, { _id: false });

  // Main TechelonsData schema
  const TechelonsDataSchema = new mongoose.Schema({
    festInfo: FestInfoSchema,
    eventCategories: {
      type: Map,
      of: String
    },
    registrationStatus: {
      type: Map,
      of: String
    },
    festDays: {
      type: Map,
      of: String
    },
    eventImages: {
      type: Map,
      of: String
    },
    whatsappGroups: {
      type: Map,
      of: String
    },
    events: [EventSchema],
    uiContent: UIContentSchema
  }, { timestamps: true });

  // Return the model
  return mongoose.models.TechelonsData || mongoose.model('TechelonsData', TechelonsDataSchema);
};

// Migration function for site content
async function migrateSiteContent() {
  try {
    const SiteContent = defineSiteContentSchema();
    
    // Check if data already exists
    const existingData = await SiteContent.findOne({});
    
    if (existingData) {
      console.log('Site content data already exists in the database. Skipping migration.');
      return;
    }

    // Create new site content document
    const newSiteContent = new SiteContent(siteContent);
    await newSiteContent.save();
    
    console.log('Site content data migrated successfully');
  } catch (error) {
    console.error('Error migrating site content data:', error);
  }
}

// Migration function for techelons data
async function migrateTechelonsData() {
  try {
    const TechelonsData = defineTechelonsDataSchema();
    
    // Check if data already exists
    const existingData = await TechelonsData.findOne({});
    
    if (existingData) {
      console.log('Techelons data already exists in the database. Skipping migration.');
      return;
    }

    // Format techelons data
    const techelonsDataFormatted = {
      festInfo: techelonsData.festInfo,
      eventCategories: new Map(Object.entries(techelonsData.eventCategories)),
      registrationStatus: new Map(Object.entries(techelonsData.registrationStatus)),
      festDays: new Map(Object.entries(techelonsData.festDays)),
      eventImages: new Map(Object.entries(techelonsData.EVENT_IMAGES)),
      whatsappGroups: new Map(Object.entries(techelonsData.whatsappGroups)),
      events: techelonsData.events,
      // Add UI content if it exists in the data
      uiContent: techelonsData.uiContent || {}
    };

    // Create new techelons data document
    const newTechelonsData = new TechelonsData(techelonsDataFormatted);
    await newTechelonsData.save();
    
    console.log('Techelons data migrated successfully');
  } catch (error) {
    console.error('Error migrating techelons data:', error);
  }
}

// Main migration function
async function runMigration() {
  // First import the data
  const dataImported = await importData();
  
  if (!dataImported) {
    console.error('Failed to import data files. Migration aborted.');
    process.exit(1);
  }
  
  const isConnected = await connectToMongoDB();
  
  if (!isConnected) {
    console.error('Failed to connect to MongoDB. Migration aborted.');
    process.exit(1);
  }
  
  // Run migrations
  await migrateSiteContent();
  await migrateTechelonsData();
  
  console.log('Migration complete');
  process.exit(0);
}

// Run the migration
runMigration(); 
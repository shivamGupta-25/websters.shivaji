import mongoose from 'mongoose';

// Define schemas for nested objects
const FestInfoDatesSchema = new mongoose.Schema({
    day1: String,
    day2: String,
    registrationDeadline: String
}, { _id: false });

const FestInfoSchema = new mongoose.Schema({
    registrationEnabled: Boolean,
    comingSoonEnabled: Boolean,
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

// Create model if it doesn't exist already
export default mongoose.models.TechelonsData || mongoose.model('TechelonsData', TechelonsDataSchema);
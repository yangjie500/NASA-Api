import mongoose from "mongoose";

interface ILaunch {
  flightNumber: number;
  mission: string;
  rocket: string;
  launchDate: Date;
  target: string;
  customer: string[];
  upcoming: boolean;
  success: boolean;
}

const launchesSchema = new mongoose.Schema<ILaunch>({
  flightNumber: {
    type: Number,
    required: true
  },
  launchDate: {
    type: Date,
    required: true
  },
  mission: {
    type: String,
    required: true
  },
  rocket: {
    type: String,
    required: true
  },
  target: {
    type: String,
  },
  customer: {
    type: [String]
  },
  upcoming: {
    type: Boolean,
    required: true,
    default: true
  },
  success: {
    type: Boolean,
    required: true,
    default: true
  }
});

// Connects launchesSchema with "launches" collection
const launches = mongoose.model<ILaunch>('Launch', launchesSchema);

export default launches;
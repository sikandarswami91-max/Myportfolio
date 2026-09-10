import mongoose, { Schema, Document } from 'mongoose';

export interface IResume extends Document {
  fileName: string;
  fileUrl: string;
  publicId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema = new Schema<IResume>(
  {
    fileName: {
      type: String,
      required: true,
      default: 'Sikandar_MERN_Resume.pdf',
    },
    fileUrl: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Resume = mongoose.models.Resume || mongoose.model<IResume>('Resume', ResumeSchema);

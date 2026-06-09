import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    size: { type: Number, required: true },
    fileId: { type: String, required: true },
    vectorStoreId: { type: String, required: true },
    vectorStoreFileId: { type: String, default: null },
    status: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Document = mongoose.model('Document', documentSchema);

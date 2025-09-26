import { Schema, model } from "mongoose";

const CommitSchema = new Schema({
  sha: { type: String, index: true },
  repoFullName: { type: String, index: true },
  author: Schema.Types.Mixed,
  message: String,
  date: Date,
  integrationUserId: { type: String, index: true },
  raw: Schema.Types.Mixed
}, { timestamps: true });

CommitSchema.index({ message: "text" });

export default model("Commit", CommitSchema);
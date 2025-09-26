import { Schema, model } from "mongoose";

const IssueSchema = new Schema({
  id: { type: Number, index: true },
  number: Number,
  repoFullName: String,
  title: String,
  state: String,
  user: Schema.Types.Mixed,
  created_at: Date,
  updated_at: Date,
  integrationUserId: { type: String, index: true },
  raw: Schema.Types.Mixed
}, { timestamps: true });

IssueSchema.index({ title: "text" });

export default model("Issue", IssueSchema);
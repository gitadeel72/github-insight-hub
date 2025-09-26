import { Schema, model } from "mongoose";

const PullSchema = new Schema({
  id: { type: Number, index: true },
  number: Number,
  repoFullName: String,
  title: String,
  state: String,
  user: Schema.Types.Mixed,
  created_at: Date,
  merged_at: Date,
  integrationUserId: { type: String, index: true },
  raw: Schema.Types.Mixed
}, { timestamps: true });

PullSchema.index({ title: "text" });

export default model("Pull", PullSchema);
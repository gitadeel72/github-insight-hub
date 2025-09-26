import { Schema, model } from "mongoose";

const ChangelogSchema = new Schema({
  repoFullName: String,
  issueNumber: Number,
  changelog: Schema.Types.Mixed,
  integrationUserId: { type: String, index: true },
  raw: Schema.Types.Mixed
}, { timestamps: true });

export default model("Changelog", ChangelogSchema);
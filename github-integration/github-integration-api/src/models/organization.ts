import { Schema, model } from "mongoose";

const OrgSchema = new Schema({
  githubId: { type: String, index: true },
  login: String,
  name: String,
  url: String,
  raw: Schema.Types.Mixed,
  integrationUserId: { type: String, index: true }
}, { timestamps: true });

OrgSchema.index({ login: "text", name: "text" });

export default model("Organization", OrgSchema);
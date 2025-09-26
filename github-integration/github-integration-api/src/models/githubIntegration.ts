import { Schema, model } from "mongoose";

const GithubIntegrationSchema = new Schema({
  provider: { type: String, default: "github" },
  userId: { type: String, required: true },
  githubId: { type: String, required: true },
  username: { type: String },
  accessToken: { type: String, required: true },
  scope: { type: String },
  connectedAt: { type: Date, default: Date.now }
}, { timestamps: true });

GithubIntegrationSchema.index({ userId: 1, provider: 1 }, { unique: true });

export default model("GithubIntegration", GithubIntegrationSchema);
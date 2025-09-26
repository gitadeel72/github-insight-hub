import { Schema, model } from "mongoose";

const GithubUserSchema = new Schema({
  githubId: Number,
  login: String,
  name: String,
  email: String,
  integrationUserId: { type: String, index: true },
  raw: Schema.Types.Mixed
}, { timestamps: true });

GithubUserSchema.index({ login: "text", name: "text" });

export default model("GithubUser", GithubUserSchema);
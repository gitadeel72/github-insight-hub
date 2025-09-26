import { Schema, model } from "mongoose";

const RepoSchema = new Schema({
  githubId: { type: Number, index: true },
  name: String,
  full_name: String,
  private: Boolean,
  ownerLogin: String,
  integrationUserId: { type: String, index: true },
  raw: Schema.Types.Mixed
}, { timestamps: true });

RepoSchema.index({ name: "text", full_name: "text" });

export default model("Repo", RepoSchema);
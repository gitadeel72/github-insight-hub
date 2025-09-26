import dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT||3000,
  mongoUri: process.env.MONGO_URI||'',
  githubClientId: process.env.GITHUB_CLIENT_ID||'',
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET||'',
  githubCallbackUrl: process.env.GITHUB_CALLBACK_URL||'', 
  frontendUrl: process.env.FRONTEND_URL||'',
};
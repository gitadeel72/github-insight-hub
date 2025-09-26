import { Request, Response } from "express";
import config from "../config";
import GithubIntegration from "../models/githubIntegration";
import { GithubService } from "../services/github.service";
import Repo from "../models/repo";
import Commit from "../models/commit";
import Pull from "../models/pull";
import Issue from "../models/issue";
import Organization from "../models/organization";
import GithubUser from "../models/githubUser";
import Changelog from "../models/changelog";
import mongoose from "mongoose";

const entityModelMap: Record<string, any> = {
  repos: Repo,
  commits: Commit,
  pulls: Pull,
  issues: Issue,
  organizations: Organization,
  githubusers: GithubUser,
  changelogs: Changelog,
};

export const redirectToGithub = (req: Request, res: Response) => {
  const state = (req.query.state as string) || "no-state";
  const url = GithubService.getAuthRedirectUrl(state);
  res.redirect(url);
};

export const githubCallback = async (req: Request, res: Response) => {
  const { code, state } = req.body as { code?: string; state?: string };
  if (!code) return res.status(400).json({ message: "Code missing" });
  try {
    const tokenRes = await GithubService.exchangeCodeForToken(code);
    console.log(JSON.stringify(tokenRes));
    
    if (!tokenRes.access_token)
      return res.status(400).json({ message: "No access token returned" });
    const accessToken = tokenRes.access_token;
    console.log("accessToken", accessToken);

    const ghUser = await GithubService.getUserForToken(accessToken);
    console.log("ghUser", ghUser);

    const integration = await GithubIntegration.findOneAndUpdate(
      { userId: ghUser.id, provider: "github" },
      {
        provider: "github",
        userId: ghUser.id,
        githubId: ghUser.id,
        username: ghUser.login,
        accessToken,
        scope: tokenRes.scope,
        connectedAt: new Date(),
      },
      { upsert: true, new: true }
    );
    GithubService.syncAllForIntegration(integration).catch((err) =>
      console.error("Background sync failed:", err)
    );
    const redirectUrl = `${
      config.frontendUrl
    }/github/callback?status=success&user=${encodeURIComponent(ghUser.login)}`;
    // res.redirect(redirectUrl);
    res.json({
      success: true,
      message: "Resync started",
      userName: encodeURIComponent(ghUser.login),
      userId: ghUser.id,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "OAuth failed", details: err.message });
  }
};

export const removeIntegration = async (req: Request, res: Response) => {
  try {
    const deleted = await GithubIntegration.findOneAndDelete({
      provider: "github",
    });
    await Repo.deleteMany();
    await Commit.deleteMany();
    await Pull.deleteMany();
    await Issue.deleteMany();
    await Organization.deleteMany();
    await GithubUser.deleteMany();
    await Changelog.deleteMany();
    return res.json({ success: true, removed: !!deleted });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const resyncIntegration = async (req: Request, res: Response) => {
  try {
    const integration = await GithubIntegration.findOne();
    if (!integration)
      return res.status(404).json({ message: "Integration not found" });
    GithubService.syncAllForIntegration(integration)
      .then(() => {
        console.log("Resync complete");
      })
      .catch((err) => console.error("Resync error:", err));
    return res.json({ success: true, message: "Resync started" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const getIntegrationStatus = async (req: Request, res: Response) => {
  // userId will come from custom header set by Angular interceptor
  const userId = req.headers["x-user-id"] as string;

  if (!userId) {
    return res.status(400).json({ message: "userId not found" });
  }
  try {
    const integration = await GithubIntegration.findOne({ userId });
    if (!integration) {
      return res.json({ connected: false });
    }

    return res.json({
      connected: true,
      userId: integration.userId, // ✅ echo back userId
      username: integration.username,
      connectedAt: integration.connectedAt,
      scope: integration.scope,
    });
  } catch (err: any) {
    console.error("Error in getIntegrationStatus:", err);
    res.status(500).json({ message: err.message });
  }
};
export const getCollections = async (req: Request, res: Response) => {
try {
    const names = await mongoose.connection.db.listCollections().toArray();
    // Only include GitHub related collections
    const allowed = ['organizations', 'repos', 'commits', 'pulls', 'issues', 'changelogs', 'githubusers'];
    const collections = names.map((c) => c.name).filter((name) => allowed.includes(name));
    res.json({ collections });
  } catch (error) {
    console.error('Error listing collections:', error);
    res.status(500).json({ error: 'Failed to list collections' });
  }
};

export const getEntityData = async (req: Request, res: Response) => {
  const entity = req.params.entity;
  const Model = entityModelMap[entity];
  if (!Model) return res.status(400).json({ message: "Unknown entity" });

  const { page = 1, limit = 20 } = req.query;
  const opts = ((): any => {
    try {
      return JSON.parse(String(req.query.filter || "{}"));
    } catch {
      return {};
    }
  })();

  const {
    page: p,
    limit: l,
    sortField,
    sortOrder,
    filter,
    search,
  } = require("../helpers/pagination").parseQueryOptions(req.query);

  const queryFilter: any = { ...opts };
  if (req.query.integrationUserId)
    queryFilter.integrationUserId = String(req.query.integrationUserId);

  if (search) {
    queryFilter.$text = { $search: search };
  }

  if (filter) Object.assign(queryFilter, filter);

  try {
    const sort: any = {};
    if (sortField) sort[sortField] = sortOrder === "asc" ? 1 : -1;
    else sort.createdAt = -1;

    const results = await Model.find(queryFilter)
      .sort(sort)
      .skip((p - 1) * l)
      .limit(l)
      .lean();
    // Determine all fields present in documents for dynamic columns
    const fields = new Set<string>();
    results.forEach((doc: any) => {
      flattenKeys(doc).forEach((k) => fields.add(k));
    });

    const total = await Model.countDocuments(queryFilter);
    res.json({
      data: results,
      fields:Array.from(fields),
      pagination: { page: p, limit: l, total },
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
function flattenKeys(obj: any, prefix = ''): string[] {
  let keys: string[] = [];
  for (const k of Object.keys(obj)) {
    const val = obj[k];
    const newKey = prefix ? `${prefix}.${k}` : k;
    keys.push(newKey);
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      keys = keys.concat(flattenKeys(val, newKey));
    }
  }
  return keys;
}
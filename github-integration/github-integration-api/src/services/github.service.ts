import axios, { AxiosInstance } from "axios";
import config from "../config";
import GithubIntegration from "../models/githubIntegration";
import Organization from "../models/organization";
import Repo from "../models/repo";
import Commit from "../models/commit";
import Pull from "../models/pull";
import Issue from "../models/issue";
import GithubUser from "../models/githubUser";
import { bulkUpsert } from "../helpers/bulkUpsert";

const GITHUB_API = "https://api.github.com";

export class GithubService {
  private axiosInstance: AxiosInstance;

  constructor(token?: string) {
    this.axiosInstance = axios.create({
      baseURL: GITHUB_API,
      headers: token ? { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" } : { Accept: "application/vnd.github+json" }
    });
  }

  static getAuthRedirectUrl(state: string) {
    const params = new URLSearchParams({
      client_id: config.githubClientId,
      redirect_uri: config.githubCallbackUrl,
      scope: "repo,read:org",
      state
    });
    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  }

  static async exchangeCodeForToken(code: string) {
    const res = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: config.githubClientId,
        client_secret: config.githubClientSecret,
        code,
        redirect_uri: config.githubCallbackUrl
      },
      { headers: { Accept: "application/json" } }
    );
    return res.data;
  }

  static async getUserForToken(token: string) {
    const client = new GithubService(token);
    const res = await client.axiosInstance.get("/user");
    return res.data;
  }

  static async fetchAllPaged(token: string, url: string, per_page = 100) {
    const client = new GithubService(token);
    let nextUrl: string | null = `${url}${url.includes("?") ? "&" : "?"}per_page=${per_page}`;
    const results: any[] = [];
    while (nextUrl) {
      const res = await client.axiosInstance.get(nextUrl.replace(GITHUB_API, ""));
      results.push(...res.data);
      const link = res.headers.link;
      if (link) {
        const m = /<([^>]+)>;\s*rel="next"/.exec(link);
        nextUrl = m ? m[1] : null;
      } else {
        nextUrl = null;
      }
    }    
    return results;
  }

  static async syncAllForIntegration(integration: any) {
    const token: string = integration.accessToken;
    const githubUser = integration.username;
    const orgs = await this.fetchAllPaged(token, `${GITHUB_API}/user/orgs`);
        console.log("orgs---------->",orgs);

    const orgDocs = orgs.map((o: any) => ({ githubId: o.id, login: o.login, name: o.name, url: o.url, raw: o, integrationUserId: integration.userId }));
    console.log("orgDocs---------->",orgDocs);
    
    await bulkUpsert(Organization, orgDocs, "githubId");

    const userRepos = await this.fetchAllPaged(token, `${GITHUB_API}/user/repos`);
    const repoDocs: any[] = userRepos.map((r: any) => ({
      githubId: r.id,
      name: r.name,
      full_name: r.full_name,
      private: r.private,
      ownerLogin: r.owner?.login,
      raw: r,
      integrationUserId: integration.userId
    }));
    for (const org of orgs) {
      const orgRepos = await this.fetchAllPaged(token, `${GITHUB_API}/orgs/${org.login}/repos`);
      repoDocs.push(...orgRepos.map((r: any) => ({
        githubId: r.id,
        name: r.name,
        full_name: r.full_name,
        private: r.private,
        ownerLogin: r.owner?.login,
        raw: r,
        integrationUserId: integration.userId
      })));
    }
    await bulkUpsert(Repo, repoDocs, "githubId");

    for (const repo of repoDocs) {
      const repoFull = repo.full_name;
      try {
        const commits = await this.fetchAllPaged(token, `${GITHUB_API}/repos/${repoFull}/commits`);
        const commitDocs = commits.map((c: any) => ({
          sha: c.sha,
          repoFullName: repoFull,
          author: c.commit?.author,
          message: c.commit?.message,
          date: c.commit?.author?.date ? new Date(c.commit.author.date) : undefined,
          raw: c,
          integrationUserId: integration.userId
        }));
        await bulkUpsert(Commit, commitDocs, "sha");

        const pulls = await this.fetchAllPaged(token, `${GITHUB_API}/repos/${repoFull}/pulls?state=all`);
        const pullDocs = pulls.map((p: any) => ({
          id: p.id,
          number: p.number,
          repoFullName: repoFull,
          title: p.title,
          state: p.state,
          user: p.user,
          created_at: p.created_at ? new Date(p.created_at) : undefined,
          merged_at: p.merged_at ? new Date(p.merged_at) : undefined,
          raw: p,
          integrationUserId: integration.userId
        }));
        await bulkUpsert(Pull, pullDocs, "id");

        const issues = await this.fetchAllPaged(token, `${GITHUB_API}/repos/${repoFull}/issues?state=all`);
        const issueDocs = issues.map((is: any) => ({
          id: is.id,
          number: is.number,
          repoFullName: repoFull,
          title: is.title,
          state: is.state,
          user: is.user,
          created_at: is.created_at ? new Date(is.created_at) : undefined,
          updated_at: is.updated_at ? new Date(is.updated_at) : undefined,
          raw: is,
          integrationUserId: integration.userId
        }));
        await bulkUpsert(Issue, issueDocs, "id");
      } catch (err: any) {
        console.warn(`Error syncing repo ${repoFull}:`, err?.message || err);
      }
    }

    const user = await this.getUserForToken(token);
    await bulkUpsert(GithubUser, [{ githubId: user.id, login: user.login, name: user.name, email: user.email, raw: user, integrationUserId: integration.userId }], "githubId");
  }

  static async getIntegrationByUserId(userId: string) {
    return GithubIntegration.findOne({ userId });
  }
}
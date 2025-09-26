import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GithubApiService {
  private base = environment.apiBaseUrl;
  constructor(private http: HttpClient) {}

  orgs() { return this.http.get<any[]>(`${this.base}/entity/organizations`); }
  repos(org?: string) {
    const params = org ? new HttpParams().set('org', org) : undefined;
    return this.http.get<any[]>(`${this.base}/entity/repos`, { params });
  }

  // loadData
  loadData(selectedCollection: string,params:any) {
    return this.http.get<any[]>(`${this.base}/entity/${selectedCollection}`, { params });
  }
  commits(repo: string) {
    return this.http.get<any[]>(`${this.base}/entity/commits`, { params: {repo } });
  }




  pulls(repo: string) {
    return this.http.get<any[]>(`${this.base}/entity/pulls`);
  }
  issues(repo: string) {
    return this.http.get<any[]>(`${this.base}/entity/issues`);
  }
  issueChangelogs(org: string, repo: string, issue: string | number) {
    return this.http.get<any[]>(`${this.base}/entity/issue-changelogs`, { params: { org, repo, issue } });
  }
  users(org: string) {
    return this.http.get<any[]>(`${this.base}/entity/users`, { params: { org } });
  }
}

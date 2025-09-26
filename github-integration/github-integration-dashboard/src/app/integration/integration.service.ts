import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface IntegrationStatus {
  connected: boolean;
  connectedAt?: string;
  username?:string;
  user?: { id: string; login: string; name?: string; avatarUrl?: string };
}

@Injectable({ providedIn: 'root' })
export class IntegrationService {
  private base = environment.apiBaseUrl;
  statusSig = signal<IntegrationStatus>({ connected: false });
  loadingSig = signal(false);

  constructor(private http: HttpClient) {}
  private clientId = 'Ov23liLJxobWRDGpOLhn';
  private redirectUri = 'http://localhost:4200/integration/callback'; // must match GitHub OAuth settings
  loadStatus() {
    this.loadingSig.set(true);
    this.http.get<IntegrationStatus>(`${this.base}/status`).subscribe({
      next: (s) => { this.statusSig.set(s); this.loadingSig.set(false); },
      error: () => { this.statusSig.set({ connected: false }); this.loadingSig.set(false); }
    });
  }

  connect() {
    // backend responds with 302 redirect (or returns URL you can navigate to)

    // window.location.href = `${this.base}/connect`;  connect() {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&scope=repo,user`;
    window.location.href = githubAuthUrl;
  
  }

  remove(userId: string) {
    return this.http.delete(`${this.base}/remove/${userId}`);
  }

  resync(userId: string) {
    return this.http.post(`${this.base}/resync`, {});
  }
  callback(code: string) {
    return this.http.post(`${this.base}/callback`, { code });
  }
  getAuthRedirect(): Observable<{ url: string }> {
    return this.http.get<{ url: string }>(`${this.base}/connect`);
  }

  loadCollections() {
    return this.http.get<any>(`${this.base}/collections`);
  }
}

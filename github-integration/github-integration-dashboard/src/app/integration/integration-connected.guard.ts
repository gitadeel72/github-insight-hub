import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { IntegrationService } from './integration.service';

@Injectable({ providedIn: 'root' })
export class IntegrationConnectedGuard implements CanActivate {
  private loadedOnce = false;

  constructor(private integration: IntegrationService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    // if status not loaded once, load now
    if (!this.loadedOnce) {
      console.log("Not loaded");
      
      this.integration.loadStatus();
      this.loadedOnce = true;
    }

    // poll current signal as observable (simple approach)
    return of(this.integration.statusSig()).pipe(
      map(status => !!status?.connected),
      map(isConnected => isConnected ? true : this.router.parseUrl('/integration')),
      catchError(() => of(this.router.parseUrl('/integration')))
    );
  }
}

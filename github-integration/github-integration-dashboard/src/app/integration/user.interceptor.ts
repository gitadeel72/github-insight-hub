import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class UserInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 📝 You can fetch this from auth state, localStorage, or a service
    const userId = localStorage.getItem('x-user-id') || '';

    // Clone request with header
    const authReq = req.clone({
      setHeaders: {
        'x-user-id': userId
      }
    });
    console.log('Interceptor added header:', userId); // ✅ debug log

    return next.handle(authReq);
  }
}

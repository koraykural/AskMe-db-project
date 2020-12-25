import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ApiError } from '../interfaces';
import { AuthService } from './auth.service';

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
        }
      }),
      catchError((error) => {
        if (error instanceof HttpErrorResponse) {
          const { message, status }: ApiError = error.error;

          if (message && message.includes('Authorization token is') && token) {
            this.authService.logout();
          }
        }
        return throwError(error);
      }),
    );
  }
}

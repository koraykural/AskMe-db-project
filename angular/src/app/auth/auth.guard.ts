import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.isAuthenticated.pipe(
      map((isAuthed) => {
        if (isAuthed === null) {
          return this.authService.checkAuthentication();
        } else {
          return isAuthed;
        }
      }),
      map((isAuthed) => {
        if (!isAuthed) {
          this.router.navigateByUrl('/login');
        }
        return isAuthed;
      }),
    );
  }
}

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AnonymousGuard implements CanActivate {
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
        if (isAuthed) {
          this.router.navigateByUrl('/');
        }
        return !isAuthed;
      }),
    );
  }
}

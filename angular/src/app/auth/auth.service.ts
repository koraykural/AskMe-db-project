import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

interface AuthResponse {
  access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  jwt = new JwtHelperService();
  isAuthenticated = new BehaviorSubject<boolean>(null);
  BASE_URL = environment.API_URL;

  constructor(private router: Router, private http: HttpClient) {
    const fiveMins = 5 * 60 * 1000;
    setInterval(this.refreshToken.bind(this), fiveMins);
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }
  resetToken() {
    localStorage.setItem('token', null);
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${this.BASE_URL}/auth/login`, { email, password });
  }

  register(email: string, username: string, password: string) {
    return this.http.post<AuthResponse>(`${this.BASE_URL}/auth/register`, { email, username, password });
  }

  renewToken() {
    return this.http.get<AuthResponse>(`${this.BASE_URL}/auth/renew`);
  }

  logout() {
    localStorage.removeItem('token');
    this.isAuthenticated.next(false);
    this.router.navigateByUrl('/login');
  }

  checkAuthentication() {
    const token = localStorage.getItem('token');

    if (!token) {
      this.isAuthenticated.next(false);
      return false;
    }

    const isExpired = this.jwt.isTokenExpired(token);
    if (isExpired) {
      this.isAuthenticated.next(false);
      return false;
    }

    this.isAuthenticated.next(!isExpired);
    return !isExpired;
  }

  refreshToken() {
    const token = localStorage.getItem('token');

    if (!token) {
      return;
    }

    const expDate = this.jwt.getTokenExpirationDate(token);
    const remainingTime = expDate.getTime() - Date.now();
    const fiveMins = 5 * 60 * 1000;

    if (remainingTime < fiveMins) {
      this.renewToken().subscribe(
        (res) => {
          this.saveToken(res.access_token);
        },
        (err) => {
          this.logout();
        },
      );
    }
  }
}

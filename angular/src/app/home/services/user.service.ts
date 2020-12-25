import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

export interface UserData {
  id: string;
  email: string;
  username: string;
  askpoints: number;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userDataExists = new BehaviorSubject(false);
  userData: UserData = null;

  get askpoints() {
    return this.userData ? this.userData.askpoints : 0;
  }

  constructor(private apiService: ApiService, private authService: AuthService) {
    this.authService.isAuthenticated.subscribe((val) => {
      if (val) {
        this.setUserData();
      } else {
        this.reset();
      }
    });
  }

  setUserData() {
    this.apiService.getUserData().subscribe(
      (res) => {
        this.userData = res;
        this.userDataExists.next(true);
        console.log(res);
      },
      (err) => {
        this.userDataExists.next(false);
        console.log(err);
      },
    );
  }

  reset() {
    this.userData = null;
    this.userDataExists.next(false);
  }
}

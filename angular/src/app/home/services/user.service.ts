import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject } from 'rxjs';

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

  constructor(private apiService: ApiService) {}

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
}

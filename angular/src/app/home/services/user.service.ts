import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

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
  userData: UserData = null;

  get askpoints() {
    return this.userData ? this.userData.askpoints : 0;
  }

  constructor(private apiService: ApiService) {}

  setUserData() {
    this.apiService.getUserData().subscribe(
      (res) => {
        this.userData = res;
        console.log(res);
      },
      (err) => {
        console.log(err);
      },
    );
  }
}

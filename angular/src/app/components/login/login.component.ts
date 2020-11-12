import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  apiError = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  submit() {
    this.authService.login(this.email.value, this.password.value).subscribe(
      (res) => {
        this.authService.saveToken(res.access_token);
        this.authService.isAuthenticated.next(true);
        this.router.navigateByUrl('/');
      },
      (err) => {
        const msg = err.error.message;
        if (msg === 'User not found.') {
          this.apiError = 'Given email address is not found.';
        } else {
          this.apiError = err.error.message;
        }
      },
    );
  }
}

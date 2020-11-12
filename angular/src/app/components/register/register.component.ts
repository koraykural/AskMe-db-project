import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]),
  });

  get email() {
    return this.registerForm.get('email');
  }
  get username() {
    return this.registerForm.get('username');
  }
  get password() {
    return this.registerForm.get('password');
  }

  apiError = '';

  constructor(private authService: AuthService, private router: Router) {}

  submit() {
    this.authService.register(this.email.value, this.username.value, this.password.value).subscribe(
      (res) => {
        this.authService.saveToken(res.access_token);
        this.authService.isAuthenticated.next(true);
        this.router.navigateByUrl('/');
      },
      (err) => {
        const msg = err.error.message;
        this.apiError = msg;
      },
    );
  }

  ngOnInit(): void {}
}

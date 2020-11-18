import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { trigger, style, animate, transition } from '@angular/animations';
import { UserData, UserService } from 'src/app/home/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({
          height: 0,
        }),
        animate('400ms ease-in-out'),
      ]),
      transition(':leave', [animate('400ms ease-in-out', style({ height: 0 }))]),
    ]),
    trigger('dropShadow', [
      transition(':enter', [style({ opacity: 0 }), animate('400ms ease-in-out')]),
      transition(':leave', [animate('400ms ease-in-out', style({ opacity: 0 }))]),
    ]),
  ],
})
export class HeaderComponent implements OnInit {
  constructor(public authService: AuthService, public userService: UserService) {}

  menuOpen = false;

  signedInLinks = [
    {
      label: 'Home',
      url: '/',
    },
    {
      label: 'Ask Question',
      url: '/create',
    },
    {
      label: 'About',
      url: '/about',
    },
  ];

  unsignedInLinks = [
    {
      label: 'Login',
      url: '/login',
    },
    {
      label: 'Register',
      url: '/register',
    },
    {
      label: 'About',
      url: '/about',
    },
  ];

  ngOnInit(): void {}
}

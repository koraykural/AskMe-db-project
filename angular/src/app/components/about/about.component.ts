import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/home/services/api.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit {
  contactForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    _replyto: new FormControl('', [Validators.required, Validators.email]),
    _subject: new FormControl('', [Validators.required]),
    message: new FormControl('', [Validators.required]),
  });

  formSubmitted = new BehaviorSubject<boolean>(null);
  formSubmittedSuccessfuly = false;

  constructor(private apiService: ApiService) {}

  get name() {
    return this.contactForm.get('name');
  }

  get _replyto() {
    return this.contactForm.get('_replyto');
  }

  get _subject() {
    return this.contactForm.get('_subject');
  }

  get message() {
    return this.contactForm.get('message');
  }

  ngOnInit(): void {
    this.formSubmitted.subscribe((val) => {
      if (val) {
        this.contactForm.disable();
      }
    });
  }

  submitContactForm() {
    if (this.contactForm.invalid || this.contactForm.disabled) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.formSubmitted.next(true);
    this.apiService.postContactForm(this.contactForm.value).subscribe(
      (response) => {
        this.formSubmittedSuccessfuly = true;
        console.log(response);
      },
      (error) => {
        this.formSubmitted.next(false);
        console.log(error);
      },
    );
  }
}

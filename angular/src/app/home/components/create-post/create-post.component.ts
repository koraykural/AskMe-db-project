import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ValidationErrors } from '@angular/forms';
import { trigger, style, animate, transition } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

interface QuestionForm {
  anonymous: boolean;
  questionType: string;
  questionText: string;
  answerType: string;
  answer1: string;
  answer2: string;
  answer3: string;
  answer4: string;
  correctAnswer: number;
}

enum AnswerTypes {
  'text' = 'text',
  'multi-choice-2' = 'multi-choice-2',
  'multi-choice-4' = 'multi-choice-4',
}

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({
          height: 0,
          opacity: 0,
          margin: 0,
        }),
        animate('400ms ease-in-out'),
      ]),
      transition(':leave', [animate('400ms ease-in-out', style({ height: 0, opacity: 0, margin: 0 }))]),
    ]),
  ],
})
export class CreatePostComponent implements OnInit {
  questionForm = new FormGroup(
    {
      anonymous: new FormControl(false),
      questionType: new FormControl('text'),
      questionText: new FormControl(''),
      answerType: new FormControl('text'),
      answer1: new FormControl(''),
      answer2: new FormControl(''),
      answer3: new FormControl(''),
      answer4: new FormControl(''),
      correctAnswer: new FormControl(0),
    },
    this.questionFormValidator.bind(this),
  );

  cost: number;

  get selectedAnswerType() {
    return this.questionForm.get('answerType').value;
  }

  get correctAnswer() {
    return this.questionForm.get('correctAnswer').value;
  }

  answerTypes = [
    {
      value: 'text',
      icon: 'edit',
      label: 'Text',
    },
    {
      value: 'multi-choice-2',
      icon: 'dice-two',
      label: 'Multiple Choice 2',
    },
    {
      value: 'multi-choice-4',
      icon: 'dice-four',
      label: 'Multiple Choice 4',
    },
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  submit() {
    console.log(this.questionForm.value);
  }

  questionFormValidator(f: FormControl): ValidationErrors {
    const errors: ValidationErrors = {};

    const values: QuestionForm = f.value;

    const { anonymous, questionText, answerType, answer1, answer2, answer3, answer4, correctAnswer } = values;

    this.cost = anonymous ? 3 : 1;
    // TODO: Check cost and balance

    const questionLength = questionText.trim().length;
    if (questionLength < 5 || questionLength > 220) {
      errors['questionText'] = true;
    }

    if (answerType === AnswerTypes['multi-choice-2']) {
      if (![1, 2].includes(correctAnswer)) {
        errors['correctAnswer'] = true;
      }

      const a1l = answer1.trim().length;
      const a2l = answer2.trim().length;
      if (a1l > 120 || a1l < 1) {
        errors['answer1'] = true;
      }
      if (a2l > 120 || a2l < 1) {
        errors['answer2'] = true;
      }
    }

    if (answerType === AnswerTypes['multi-choice-4']) {
      if (![1, 2, 3, 4].includes(correctAnswer)) {
        errors['correctAnswer'] = true;
      }

      const a1l = answer1.trim().length;
      const a2l = answer2.trim().length;
      const a3l = answer3.trim().length;
      const a4l = answer4.trim().length;
      if (a1l > 120 || a1l < 1) {
        errors['answer1'] = true;
      }
      if (a2l > 120 || a2l < 1) {
        errors['answer2'] = true;
      }
      if (a3l > 120 || a3l < 1) {
        errors['answer3'] = true;
      }
      if (a4l > 120 || a4l < 1) {
        errors['answer4'] = true;
      }
    }

    return errors;
  }
}

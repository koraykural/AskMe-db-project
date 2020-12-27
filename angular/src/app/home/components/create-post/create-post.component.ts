import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { trigger, style, animate, transition } from '@angular/animations';
import { QuestionService } from '../../services/question.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { QuestionFormUtils } from '../../utils/question-form-utils';

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
      transition(':leave', [
        animate('400ms ease-in-out', style({ height: 0, opacity: 0, margin: 0 })),
      ]),
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
    this.questionFormUtils.questionFormValidator.bind(this.questionFormUtils),
  );

  anonymousQuestionCost = environment.anonymousQuestionCost;
  questionCost = environment.questionCost;
  cost: number = this.questionCost;
  buttonState: 'pending' | 'clicked' = 'pending';

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

  constructor(
    private questionService: QuestionService,
    private router: Router,
    private questionFormUtils: QuestionFormUtils,
  ) {}

  ngOnInit(): void {
    this.questionForm.get('anonymous').valueChanges.subscribe(this.setCost.bind(this));
  }

  setCost(val: number) {
    this.cost = val ? this.anonymousQuestionCost : this.questionCost;
  }

  submit() {
    this.buttonState = 'clicked';
    this.questionService.submitQuestionForm(this.questionForm).subscribe(
      (val) => {
        console.log(val);
        this.router.navigateByUrl('/');
      },
      (err) => {
        this.buttonState = 'pending';
        console.log(err);
      },
    );
  }
}

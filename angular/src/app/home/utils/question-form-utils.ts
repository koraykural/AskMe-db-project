import { FormControl, ValidationErrors, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { QuestionForm, AnswerTypes } from 'src/app/interfaces';
import { UserService } from '../services/user.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class QuestionFormUtils {
  constructor(private userService: UserService) {}

  questionFormValidator(f: FormControl): ValidationErrors {
    const errors: ValidationErrors = {};

    const anonymousQuestionCost = environment.anonymousQuestionCost;
    const questionCost = environment.questionCost;
    const values: QuestionForm = f.value;

    const { anonymous, questionText, answerType, answer1, answer2, answer3, answer4, correctAnswer } = values;

    const cost = anonymous ? anonymousQuestionCost : questionCost;

    if (cost > this.userService.askpoints) {
      errors['cost'] = true;
    }

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

  reduceQuestionForm(f: FormGroup): QuestionForm {
    const values: QuestionForm = f.value;
    const {
      anonymous,
      questionType,
      questionText,
      answerType,
      answer1,
      answer2,
      answer3,
      answer4,
      correctAnswer,
    } = values;

    let reducedForm: QuestionForm = {
      anonymous,
      questionText,
      questionType,
      answerType,
    };

    if (answerType !== AnswerTypes['text']) {
      reducedForm = {
        ...reducedForm,
        answer1,
        answer2,
        correctAnswer,
      };

      if (answerType === AnswerTypes['multi-choice-4']) {
        reducedForm = {
          ...reducedForm,
          answer3,
          answer4,
        };
      }
    }

    return reducedForm;
  }
}

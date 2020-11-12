import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';

import { faArrowCircleUp, faDiceFour, faDiceTwo, faEdit, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { faArrowCircleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { PostComponent } from './components/post/post.component';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { PostPlaceholderComponent } from './components/post-placeholder/post-placeholder.component';
import { SharedModule } from '../shared/shared.module';
import { QuestionComponent } from './components/post/question/question.component';
import { AnswerComponent } from './components/post/answer/answer.component';
import { AnswerMultiTwoComponent } from './components/post/answer/answer-multi-two/answer-multi-two.component';
import { AnswerMultiFourComponent } from './components/post/answer/answer-multi-four/answer-multi-four.component';
import { QuestionTextComponent } from './components/post/question/question-text/question-text.component';
import { AnswerTextComponent } from './components/post/answer/answer-text/answer-text.component';

@NgModule({
  declarations: [
    HomeComponent,
    PostComponent,
    QuestionTextComponent,
    AnswerTextComponent,
    CreatePostComponent,
    PostPlaceholderComponent,
    QuestionComponent,
    AnswerComponent,
    AnswerMultiTwoComponent,
    AnswerMultiFourComponent,
  ],
  imports: [CommonModule, HomeRoutingModule, FontAwesomeModule, SharedModule],
})
export class HomeModule {
  icons = [faArrowCircleDown, faArrowCircleUp, faDiceFour, faDiceTwo, faEdit, faCheckCircle];

  constructor(library: FaIconLibrary) {
    library.addIcons(...this.icons);
  }
}

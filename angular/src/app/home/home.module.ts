import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';

import { faArrowCircleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { PostComponent } from './components/post/post.component';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { PostPlaceholderComponent } from './components/post-placeholder/post-placeholder.component';
import { SharedModule } from '../shared/shared.module';
import { TextareaAutosizeModule } from 'ngx-textarea-autosize';
import { TimeagoModule, TimeagoFormatter, TimeagoClock, TimeagoDefaultClock } from 'ngx-timeago';
import { QuestionComponent } from './components/post/question/question.component';
import { AnswerComponent } from './components/post/answer/answer.component';
import { AnswerMultiTwoComponent } from './components/post/answer/answer-multi-two/answer-multi-two.component';
import { AnswerMultiFourComponent } from './components/post/answer/answer-multi-four/answer-multi-four.component';
import { AnswerTextComponent } from './components/post/answer/answer-text/answer-text.component';
import {
  faArrowCircleUp,
  faDiceFour,
  faDiceTwo,
  faEdit,
  faCheckCircle,
  faPaperPlane,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { CustomTimeagoFormatter } from './utils/custom-timeago-formatter';

@NgModule({
  declarations: [
    HomeComponent,
    PostComponent,
    AnswerTextComponent,
    CreatePostComponent,
    PostPlaceholderComponent,
    QuestionComponent,
    AnswerComponent,
    AnswerMultiTwoComponent,
    AnswerMultiFourComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FontAwesomeModule,
    SharedModule,
    TextareaAutosizeModule,
    TimeagoModule.forChild({
      formatter: { provide: TimeagoFormatter, useClass: CustomTimeagoFormatter },
      clock: { provide: TimeagoClock, useClass: TimeagoDefaultClock },
    }),
  ],
})
export class HomeModule {
  icons = [faArrowCircleDown, faArrowCircleUp, faDiceFour, faDiceTwo, faEdit, faCheckCircle, faPaperPlane, faSpinner];

  constructor(library: FaIconLibrary) {
    library.addIcons(...this.icons);
  }
}

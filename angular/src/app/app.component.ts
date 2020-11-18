import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { slideAnimation } from './shared/route-animations';
import { QuestionService } from './home/services/question.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [slideAnimation],
})
export class AppComponent {
  title = 'AskMe';

  constructor(private questionService: QuestionService) {}

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
  onScroll(e: any) {
    if (e.target.offsetHeight + e.target.scrollTop + 300 >= e.target.scrollHeight) {
      this.questionService.scrollEnd();
    }
  }
}

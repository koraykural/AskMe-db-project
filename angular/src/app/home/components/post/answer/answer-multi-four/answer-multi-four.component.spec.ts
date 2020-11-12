import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerMultiFourComponent } from './answer-multi-four.component';

describe('AnswerMultiFourComponent', () => {
  let component: AnswerMultiFourComponent;
  let fixture: ComponentFixture<AnswerMultiFourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnswerMultiFourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswerMultiFourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

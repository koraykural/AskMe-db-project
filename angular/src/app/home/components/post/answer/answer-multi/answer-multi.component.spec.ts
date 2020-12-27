import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerMultiComponent } from './answer-multi.component';

describe('AnswerMultiComponent', () => {
  let component: AnswerMultiComponent;
  let fixture: ComponentFixture<AnswerMultiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnswerMultiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswerMultiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

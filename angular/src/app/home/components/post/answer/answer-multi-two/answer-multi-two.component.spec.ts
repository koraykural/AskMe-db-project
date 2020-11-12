import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerMultiTwoComponent } from './answer-multi-two.component';

describe('AnswerMultiTwoComponent', () => {
  let component: AnswerMultiTwoComponent;
  let fixture: ComponentFixture<AnswerMultiTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnswerMultiTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswerMultiTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

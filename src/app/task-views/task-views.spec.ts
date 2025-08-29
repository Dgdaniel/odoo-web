import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskViews } from './task-views';

describe('TaskViews', () => {
  let component: TaskViews;
  let fixture: ComponentFixture<TaskViews>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskViews]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskViews);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportMovementBudgetsExpensesComponent } from './report-movement-budgets-expenses.component';

describe('ReportMovementBudgetsExpensesComponent', () => {
  let component: ReportMovementBudgetsExpensesComponent;
  let fixture: ComponentFixture<ReportMovementBudgetsExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportMovementBudgetsExpensesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportMovementBudgetsExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartBudgetedAndExecutedByExpenseType } from './chart-budgeted-and-executed-by-expense-type';

describe('ChartBudgetedAndExecutedByExpenseType', () => {
  let component: ChartBudgetedAndExecutedByExpenseType;
  let fixture: ComponentFixture<ChartBudgetedAndExecutedByExpenseType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartBudgetedAndExecutedByExpenseType]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartBudgetedAndExecutedByExpenseType);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

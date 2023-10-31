import dayjs from 'dayjs';

export function groupExpensesByDate(expenses?: Expense[], timezone = 8) {
  if (!expenses?.length) {
    return [];
  }
  const grouper: Record<string, Expense[]> = {};
  expenses.forEach(expense => {
    const date = dayjs(expense.localTime)
      .utcOffset(timezone)
      .format('YYYY-MM-DD');
    if (grouper[date]) {
      grouper[date].push(expense);
    } else {
      grouper[date] = [expense];
    }
  });
  const dates = Object.keys(grouper);
  dates.sort((a, b) => dayjs(b).diff(dayjs(a)));
  return dates.map(e => ({
    date: e,
    expenses: grouper[e],
  }));
}

export function analyseExpensesSimple(
  expenses?: Expense[],
  budget: number = 0,
  utc = 8,
) {
  const today = dayjs().utcOffset(utc);
  const total = expenses?.map(e => e.amount).reduce((a, b) => a + b) ?? 0;
  const remainingDays = today.daysInMonth() - today.date() + 1;
  const remainingBudget = budget - total;
  const remainingDaily =
    remainingBudget > 0 ? remainingBudget / remainingDays : 0;

  return {
    total: total.toFixed(2),
    remainingDays,
    remainingBudget: remainingBudget.toFixed(2),
    remainingDaily: remainingDaily.toFixed(2),
    percent: Math.floor((total / budget) * 100),
  };
}

import { registerDocListener } from '@/services';
import dayjs from 'dayjs';
import { useState, type FC, useEffect, useMemo, useId } from 'react';
import { analyseExpensesSimple, groupExpensesByDate } from './lib';
import ExpenseList from './expense-list';
import { Progress } from 'antd';

interface BookKeepingProps {
  id: string;
  userdata: UserData;
}

const BookKeeping: FC<BookKeepingProps> = ({ id, userdata }) => {
  const keyId = useId();
  const [book, setBook] = useState<Book>();

  useEffect(() => {
    return registerDocListener(
      'bookkeeping',
      `${id}-${dayjs()
        .utcOffset(userdata?.timezone ?? 8)
        .format('YYYY-MM')}`,
      snapshot => {
        if (snapshot.exists()) {
          setBook(snapshot.data() as Book);
        }
      },
    );
  }, []);

  const analyse = useMemo(
    () =>
      analyseExpensesSimple(book?.expenses, userdata.budget, userdata.timezone),
    [book?.expenses, userdata.budget, userdata.timezone],
  );
  const groupedExpenses = useMemo(
    () => groupExpensesByDate(book?.expenses, userdata.timezone ?? 8),
    [book?.expenses],
  );

  return (
    <section>
      {userdata.budget ? (
        <div className="text-align-right">
          {userdata.budget ? (
            <Progress
              percent={analyse.percent}
              // format={percent =>
              //   `${percent}% ${analyse.total} / ${userdata.budget}`
              // }
            />
          ) : null}
          <p>
            本月已支出 {analyse.total}，预算还剩 {analyse.remainingBudget}。
          </p>
          <p>
            本月还剩 {analyse.remainingDays} 天，剩余日均{' '}
            {analyse.remainingDaily}。
          </p>
        </div>
      ) : (
        <p>
          本月已支出 {analyse.total}，{userdata?.nickname ?? '大哥哥'}
          尚未设置预算，可通过「预算」命令进行设置
        </p>
      )}
      <div>
        {groupedExpenses?.map(e => (
          <ExpenseList
            key={`${keyId}-${e.date}`}
            date={e.date}
            expenses={e.expenses}
          />
        ))}
      </div>
    </section>
  );
};

export default BookKeeping;

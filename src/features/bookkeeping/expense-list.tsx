import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, List, Typography } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { FC, useId } from 'react';

interface ExpenseListProps {
  date: string | Date | Dayjs;
  expenses: Expense[];
}

const ExpenseList: FC<ExpenseListProps> = ({
  date = new Date(),
  expenses = [],
}) => {
  const id = useId();

  return (
    <article>
      <div className="apart">
        <Typography.Title level={3}>
          {dayjs(date).format('MMMM D')}
        </Typography.Title>
        <Typography.Title level={3}>
          {expenses
            .map(_e => _e.amount)
            .reduce((a, b) => a + b)
            .toFixed(2)}
        </Typography.Title>
      </div>
      <List<Expense>
        dataSource={expenses}
        renderItem={expense => (
          <List.Item
            actions={[
              <Button key={`${id}-${expense.localTime}-amount`} type="text">
                <b>{expense.amount}</b>
              </Button>,
              <Button
                key={`${id}-${expense.localTime}-edit`}
                type="link"
                icon={<EditOutlined />}
                disabled
              />,
              <Button
                key={`${id}-${expense.localTime}-edit`}
                danger
                type="link"
                icon={<DeleteOutlined />}
                disabled
              />,
            ]}>
            <>
              <List.Item.Meta
                title={expense.category}
                description={dayjs(expense.localTime).format('LTS')}
              />
            </>
          </List.Item>
        )}
      />
    </article>
  );
};

export default ExpenseList;

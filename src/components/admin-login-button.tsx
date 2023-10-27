import { adminLogin } from '@/services';
import { Button, Form, Input, Modal } from 'antd';
import { useState } from 'react';

export default function AdminLoginButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          setOpen(true);
        }}>
        管理员登录
      </Button>
      <Modal open={open} onCancel={() => setOpen(false)} footer={null}>
        <Form
          onFinish={async values => {
            const { email, password } = values;
            await adminLogin(email, password);
            setOpen(false);
          }}>
          <Form.Item name="email" label="Email">
            <Input placeholder="email" />
          </Form.Item>
          <Form.Item name="password" label="Password">
            <Input.Password placeholder="password" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form>
      </Modal>
    </>
  );
}

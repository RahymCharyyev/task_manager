import { Flex, Card, Form, Input, Button, Typography } from 'antd';
import { Navigate, useNavigate } from 'react-router-dom';
import { SkipToMain, ThemeToggle } from '../components';
import { authStore } from '../stores';

export function LoginPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm<{ email: string; password: string }>();

  if (authStore.isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  function onFinish(values: { email: string; password: string }) {
    authStore.login(values.email, values.password);
    navigate('/', { replace: true });
  }

  return (
    <>
      <SkipToMain />
      <Flex
        vertical
        className='min-h-svh bg-gradient-to-br from-slate-100 via-white to-sky-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'
      >
        <Flex justify='flex-end' className='p-4'>
          <ThemeToggle />
        </Flex>
        <Flex flex={1} justify='center' align='center' className='p-6'>
          <main
            id='main-content'
            tabIndex={-1}
            className='w-full max-w-md outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1677ff]'
          >
            <Card
              title={
                <span className='text-balance font-semibold tracking-tight'>
                  Sign In
                </span>
              }
              className='border-0 shadow-xl shadow-slate-900/15 ring-1 ring-slate-900/[0.07] dark:shadow-black/50 dark:ring-white/10'
              bodyStyle={{ paddingTop: 24 }}
            >
              <Typography.Paragraph
                type='secondary'
                className='text-pretty'
                style={{ marginTop: 0 }}
              >
                Mock login — use any email and password.
              </Typography.Paragraph>
              <Form
                form={form}
                layout='vertical'
                requiredMark={false}
                onFinish={onFinish}
                initialValues={{ email: '', password: '' }}
              >
                <Form.Item
                  label='Email'
                  name='email'
                  rules={[
                    { required: true, message: 'Enter your email.' },
                    { type: 'email', message: 'Enter a valid email address.' },
                  ]}
                >
                  <Input
                    autoComplete='username'
                    spellCheck={false}
                    placeholder='you@example.com…'
                  />
                </Form.Item>
                <Form.Item
                  label='Password'
                  name='password'
                  rules={[{ required: true, message: 'Enter your password.' }]}
                >
                  <Input.Password
                    autoComplete='current-password'
                    placeholder='Password…'
                  />
                </Form.Item>
                <Form.Item style={{ marginBottom: 0 }}>
                  <Button type='primary' htmlType='submit' block size='large'>
                    Log In
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </main>
        </Flex>
      </Flex>
    </>
  );
}

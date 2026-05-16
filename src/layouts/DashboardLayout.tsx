import { LogoutOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, Space, theme, Typography } from 'antd';
import { observer } from 'mobx-react-lite';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AppLogo, SkipToMain, ThemeToggle } from '../components';
import { authStore } from '../stores';

const { Header, Sider, Content } = Layout;

export const DashboardLayout = observer(function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();

  function handleLogout() {
    authStore.logout();
    navigate('/login', { replace: true });
  }

  const menuSelected =
    location.pathname === '/' || location.pathname.startsWith('/tasks/')
      ? ['/']
      : [location.pathname];

  return (
    <>
      <SkipToMain />
      <Layout className='min-h-svh antialiased bg-slate-50 dark:bg-[#0f172a] relative overflow-hidden'>
        {/* Decorative background blobs */}
        <div className='absolute top-0 left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none' />
        <div className='absolute bottom-0 right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none' />
        <Sider
          breakpoint='lg'
          collapsedWidth={0}
          width={260}
          className='flex flex-col glass z-10 border-e border-white/20 dark:border-white/10'
        >
          <div className='px-5 pt-6 pb-4'>
            <AppLogo />
          </div>
          <div className='min-h-0 flex-1'>
            <Menu
              mode='inline'
              selectedKeys={menuSelected}
              style={{
                borderInlineEnd: 'none',
                background: 'transparent',
              }}
              items={[
                {
                  key: '/',
                  icon: (
                    <span aria-hidden>
                      <UnorderedListOutlined />
                    </span>
                  ),
                  label: 'Tasks',
                  onClick: () => navigate('/'),
                },
              ]}
            />
          </div>
          <div className='mt-auto px-4 pb-6 pt-2'>
            <Button
              block
              icon={
                <span aria-hidden>
                  <LogoutOutlined />
                </span>
              }
              onClick={handleLogout}
            >
              Log Out
            </Button>
          </div>
        </Sider>
        <Layout>
          <Header
            className='sticky top-0 z-20 glass flex items-center justify-between border-b border-white/20 dark:border-white/10 px-6 py-3'
            style={{ height: 'auto', lineHeight: token.lineHeight }}
          >
            <Typography.Title
              level={4}
              className='text-balance !mb-0 font-heading !font-semibold tracking-tight gradient-text'
              style={{ margin: 0 }}
            >
              Dashboard
            </Typography.Title>
            <Space wrap align='center'>
              <Typography.Text type='secondary'>
                Signed in as{' '}
                <Typography.Text strong>
                  {authStore.user?.email}
                </Typography.Text>
              </Typography.Text>
              <ThemeToggle />
            </Space>
          </Header>
          <Content
            className='mx-auto w-full max-w-6xl glass-card rounded-2xl relative z-10'
            style={{
              margin: '24px',
              padding: '24px',
              minHeight: 280,
            }}
          >
            <main
              id='main-content'
              tabIndex={-1}
              className='outline-none motion-safe:scroll-mt-24 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1677ff]'
            >
              <Outlet />
            </main>
          </Content>
        </Layout>
      </Layout>
    </>
  );
});

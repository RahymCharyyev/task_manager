import {
  LogoutOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import { Button, Layout, Menu, Space, theme, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { SkipToMain } from '../components/SkipToMain'
import { ThemeToggle } from '../components/ThemeToggle'
import { authStore } from '../stores/authStore'

const { Header, Sider, Content } = Layout

export const DashboardLayout = observer(function DashboardLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { token } = theme.useToken()

  function handleLogout() {
    authStore.logout()
    navigate('/login', { replace: true })
  }

  const menuSelected =
    location.pathname === '/' || location.pathname.startsWith('/tasks/')
      ? ['/']
      : [location.pathname]

  return (
    <>
      <SkipToMain />
      <Layout
        className="min-h-svh antialiased"
        style={{ minHeight: '100vh', background: token.colorBgLayout }}
      >
        <Sider
          breakpoint="lg"
          collapsedWidth={0}
          width={232}
          className="flex flex-col shadow-[4px_0_24px_-12px_rgba(15,23,42,0.15)] dark:shadow-[4px_0_24px_-12px_rgba(0,0,0,0.45)] lg:border-e lg:border-slate-200/80 dark:lg:border-white/10"
          style={{
            borderInlineEnd: `1px solid ${token.colorBorderSecondary}`,
            background: token.colorBgContainer,
          }}
        >
          <div className="px-5 pt-6 pb-4">
            <Typography.Text type="secondary" style={{ fontSize: 11 }}>
              MINI TASKS
            </Typography.Text>
            <Typography.Paragraph
              ellipsis
              style={{ marginBottom: 0, marginTop: token.marginXS }}
              strong
            >
              {authStore.user?.email ?? '—'}
            </Typography.Paragraph>
          </div>
          <div className="min-h-0 flex-1">
            <Menu
              mode="inline"
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
          <div className="mt-auto px-4 pb-6 pt-2">
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
            className="sticky top-0 z-20 shadow-sm shadow-slate-900/5 backdrop-blur-md dark:shadow-black/40"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingInline: token.paddingLG,
              background: token.colorBgContainer,
              borderBottom: `1px solid ${token.colorBorderSecondary}`,
              height: 'auto',
              lineHeight: token.lineHeight,
              paddingBlock: token.paddingSM,
            }}
          >
            <Typography.Title
              level={4}
              className="text-balance !mb-0 !font-semibold tracking-tight"
              style={{ margin: 0 }}
            >
              Dashboard
            </Typography.Title>
            <Space wrap align="center">
              <Typography.Text type="secondary">
                Signed in as{' '}
                <Typography.Text strong>
                  {authStore.user?.email}
                </Typography.Text>
              </Typography.Text>
              <ThemeToggle />
            </Space>
          </Header>
          <Content
            className="mx-auto w-full max-w-6xl shadow-md shadow-slate-900/5 ring-1 ring-slate-900/[0.06] transition-[box-shadow] duration-300 dark:shadow-black/40 dark:ring-white/10"
            style={{
              margin: token.marginLG,
              padding: token.paddingLG,
              background: token.colorBgContainer,
              borderRadius: token.borderRadiusLG,
              border: `1px solid ${token.colorBorderSecondary}`,
              minHeight: 280,
            }}
          >
            <main
              id="main-content"
              tabIndex={-1}
              className="outline-none motion-safe:scroll-mt-24 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1677ff]"
            >
              <Outlet />
            </main>
          </Content>
        </Layout>
      </Layout>
    </>
  )
})

import { App as AntdApp, ConfigProvider, theme as antdTheme } from 'antd'
import { observer } from 'mobx-react-lite'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './queryClient'
import { AppRoutes } from './routes/AppRoutes'
import { themeStore } from './stores/themeStore'


const AppShell = observer(function AppShell() {
  const isDark = themeStore.isDark

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark
          ? antdTheme.darkAlgorithm
          : antdTheme.defaultAlgorithm,
        token: {
          borderRadiusLG: 16,
          borderRadius: 12,
          borderRadiusSM: 8,
          colorPrimary: '#6366f1',
          colorInfo: '#6366f1',
          colorSuccess: '#10b981',
          colorWarning: '#f59e0b',
          colorError: '#ef4444',
          fontFamily: "'Inter', sans-serif",
          lineHeight: 1.6,
          controlHeight: 40,
        },
        components: {
          Layout: {
            headerPadding: '14px 24px',
            headerHeight: 64,
            headerBg: 'transparent',
            bodyBg: 'transparent',
            siderBg: 'transparent',
          },
          Card: {
            headerFontSize: 16,
            borderRadiusLG: 16,
          },
          Button: {
            controlHeight: 40,
            borderRadius: 10,
            colorPrimaryHover: '#4f46e5',
            colorPrimaryActive: '#4338ca',
          },
          Input: {
            controlHeight: 40,
            borderRadius: 10,
          },
          Select: {
            controlHeight: 40,
            borderRadius: 10,
          }
        },
      }}
    >
      <AntdApp>
        <QueryClientProvider client={queryClient}>
          <AppRoutes />
        </QueryClientProvider>
      </AntdApp>
    </ConfigProvider>
  )
})

export default function App() {
  return <AppShell />
}

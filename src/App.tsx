import { App as AntdApp, ConfigProvider, theme as antdTheme } from 'antd'
import { observer } from 'mobx-react-lite'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './queryClient'
import { AppRoutes } from './routes/AppRoutes'
import { themeStore } from './stores/themeStore'

const fontStack =
  "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"

const AppShell = observer(function AppShell() {
  const isDark = themeStore.isDark

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark
          ? antdTheme.darkAlgorithm
          : antdTheme.defaultAlgorithm,
        token: {
          borderRadiusLG: 12,
          borderRadius: 10,
          colorPrimary: '#1677ff',
          fontFamily: fontStack,
          lineHeight: 1.55,
        },
        components: {
          Layout: {
            headerPadding: '14px 24px',
            headerHeight: 56,
          },
          Card: {
            headerFontSize: 15,
          },
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

import { MoonOutlined, SunOutlined } from '@ant-design/icons'
import { Segmented } from 'antd'
import { observer } from 'mobx-react-lite'
import { themeStore } from '../stores/themeStore'

export const ThemeToggle = observer(function ThemeToggle() {
  return (
    <div className="rounded-lg bg-slate-100/80 p-0.5 ring-1 ring-slate-900/10 backdrop-blur-sm dark:bg-white/5 dark:ring-white/15">
      <Segmented
        aria-label="Color theme"
        value={themeStore.mode}
        onChange={(v) => themeStore.setMode(v as 'light' | 'dark')}
        options={[
          {
            label: (
              <span aria-hidden title="Light theme">
                <SunOutlined />
              </span>
            ),
            value: 'light',
          },
          {
            label: (
              <span aria-hidden title="Dark theme">
                <MoonOutlined />
              </span>
            ),
            value: 'dark',
          },
        ]}
        className="bg-transparent"
      />
    </div>
  )
})

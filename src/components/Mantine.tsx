import { createTheme, MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import '@mantine/notifications/styles.css'
import { type ReactNode } from 'react'

const theme = createTheme({
	primaryColor: 'red'
})

export default function Mantine({ children }: { children: ReactNode }) {
	return (
		<MantineProvider defaultColorScheme='dark' theme={theme}>
			<Notifications />

			<ModalsProvider>
				{children}
			</ModalsProvider>
		</MantineProvider>
	)
}

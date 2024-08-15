import { createTheme, MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import { type ReactNode } from 'react'

const theme = createTheme({
	primaryColor: 'red'
})

export default function Mantine({ children }: { children: ReactNode }) {
	return (
		<MantineProvider defaultColorScheme='dark' theme={theme}>
			{children}
		</MantineProvider>
	)
}

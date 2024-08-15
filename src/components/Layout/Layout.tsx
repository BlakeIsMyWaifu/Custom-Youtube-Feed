import { AppShell } from '@mantine/core'
import { type ReactNode } from 'react'
import Header from './Header'

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<AppShell header={{ height: 60 }}>
			<AppShell.Header>
				<Header />
			</AppShell.Header>
			<AppShell.Main>
				{children}
			</AppShell.Main>
		</AppShell>
	)
}

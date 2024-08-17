import { AppShell } from '@mantine/core'
import { type ReactNode } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<AppShell header={{ height: 60 }} navbar={{ width: 360, breakpoint: 0 }}>
			<AppShell.Header>
				<Header />
			</AppShell.Header>
			<AppShell.Navbar component='div'>
				<Sidebar />
			</AppShell.Navbar>
			<AppShell.Main>
				{children}
			</AppShell.Main>
		</AppShell>
	)
}

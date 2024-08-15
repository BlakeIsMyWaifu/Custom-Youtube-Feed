import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import Mantine from './components/Mantine.tsx'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: Infinity
		}
	}
})

const root = document.getElementById('root')
if (!root) throw new Error('Root element not found')

createRoot(root).render(
	<StrictMode>
		<Mantine>
			<QueryClientProvider client={queryClient}>
				<App />

				<ReactQueryDevtools />
			</QueryClientProvider>
		</Mantine>
	</StrictMode>
)

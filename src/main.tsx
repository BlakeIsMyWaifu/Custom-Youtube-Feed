import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import Mantine from './components/Mantine.tsx'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Mantine>
			<App />
		</Mantine>
	</StrictMode>,
)

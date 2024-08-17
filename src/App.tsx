import Layout from '~/components/Layout'
import { useYoutubeStore } from '~/state/useYoutubeStore'
import Category from './components/Category'

export default function App() {
	const categories = useYoutubeStore(state => state.categories)

	return (
		<Layout>
			{
				categories.map(category => {
					return <Category key={category.id} category={category} />
				})
			}
		</Layout>
	)
}

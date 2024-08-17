import { Button } from '@mantine/core'
import CategoryList from '~/components/NestedList'
import { useYoutubeStore } from '~/state/useYoutubeStore'

export default function Sidebar() {
	const addCategory = useYoutubeStore(state => state.addCategory)

	return (
		<>
			<CategoryList />
			<Button onClick={() => {
				addCategory((+new Date()).toString())
			}}
			>
				New
			</Button>
		</>
	)
}

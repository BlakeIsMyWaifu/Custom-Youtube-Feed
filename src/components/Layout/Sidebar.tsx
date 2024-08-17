import { Stack } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import CategoryList from '~/components/CategoryList'
import TextInputButton from '~/components/TextInputButton'
import { useYoutubeStore } from '~/state/useYoutubeStore'

export default function Sidebar() {
	return (
		<Stack justify='space-between' h='100%'>
			<CategoryList />
			<AddCategory />
		</Stack>
	)
}

function AddCategory() {
	const addCategory = useYoutubeStore(state => state.addCategory)

	const submit = (inputValue: string) => {
		addCategory(inputValue)
	}

	return (
		<TextInputButton placeholder='Add Category' submit={submit} rightIcon={IconPlus} m='md' />
	)
}

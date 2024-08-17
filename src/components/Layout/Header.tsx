import { Group, Image, Title } from '@mantine/core'
import { IconArrowRight, IconSearch } from '@tabler/icons-react'
import TextInputButton from '~/components/TextInputButton'
import useChannelQuery from '~/hooks/useChannelQuery'
import YouTubeLogo from '/youtube.svg'

export default function Header() {
	const channelQuery = useChannelQuery()

	const searchSubmit = (inputValue: string) => {
		channelQuery.mutate(inputValue)
	}

	return (
		<Group h='100%' justify='space-between' mr='md'>
			<Group h='100%'>
				<Image src={YouTubeLogo} h='100%' w='auto' p='xs' />
				<Title>Custom YouTube Feed</Title>
			</Group>

			<TextInputButton
				placeholder='Add Channel'
				submit={searchSubmit}
				leftIcon={IconSearch}
				rightIcon={IconArrowRight}
			/>
		</Group>
	)
}

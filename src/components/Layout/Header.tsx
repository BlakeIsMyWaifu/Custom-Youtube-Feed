import { ActionIcon, Group, Image, rem, TextInput, Title } from '@mantine/core'
import { IconArrowRight, IconSearch } from '@tabler/icons-react'
import { useState } from 'react'
import useChannelQuery from '~hooks/useChannelQuery'
import YouTubeLogo from '/youtube.svg'

export default function Header() {
	return (
		<Group h='100%' justify='space-between'>
			<Group h='100%'>
				<Image src={YouTubeLogo} h='100%' w='auto' p='xs' />
				<Title>Custom YouTube Feed</Title>
			</Group>

			<ChannelInput />
		</Group>
	)
}

function ChannelInput() {
	const [inputValue, setInputValue] = useState('')

	const channelQuery = useChannelQuery()

	const submit = () => {
		channelQuery.mutate(inputValue)
	}

	return (
		<TextInput
			radius='xl'
			size='md'
			placeholder='Add Channel'
			rightSectionWidth={42}
			leftSection={<IconSearch style={{ width: rem(18), height: rem(18) }} stroke={1.5} />}
			rightSection={(
				<ActionIcon size={32} radius='xl' color='red' variant='filled' onClick={submit}>
					<IconArrowRight style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
				</ActionIcon>
			)}
			value={inputValue}
			onChange={event => {
				setInputValue(event.currentTarget.value)
			}}
			onKeyDown={event => {
				if (event.key !== 'Enter') return
				channelQuery.mutate(inputValue)
			}}
		/>
	)
}

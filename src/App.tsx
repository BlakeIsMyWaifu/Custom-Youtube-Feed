import { Button, Group, Stack, TextInput } from '@mantine/core'
import { useState } from 'react'
import useChannelQuery from './hooks/useChannelQuery'

export default function App() {
	const [channelInput, setChannelInput] = useState('')
	const channel = useChannelQuery()

	return (
		<Stack align='center' justify='center'>
			<Group align='flex-end'>
				<TextInput label='ChannelId' value={channelInput} onChange={event => { setChannelInput(event.currentTarget.value) }} />
				<Button onClick={() => { channel.mutate(channelInput) }}>Search</Button>
			</Group>
		</Stack>
	)
}

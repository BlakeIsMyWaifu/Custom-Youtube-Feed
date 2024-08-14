import { Button, Card, Group, Image, Stack, Text, TextInput } from '@mantine/core'
import { useState } from 'react'
import { useYoutubeStore } from '~state/useYoutubeStore'
import useChannelQuery from './hooks/useChannelQuery'

export default function App() {
	const [channelInput, setChannelInput] = useState('')
	const channelQuery = useChannelQuery()

	const channels = useYoutubeStore(state => state.channels)

	return (
		<Stack align='center' justify='center'>
			<Group align='flex-end'>
				<TextInput label='ChannelId' value={channelInput} onChange={event => { setChannelInput(event.currentTarget.value) }} />
				<Button onClick={() => { channelQuery.mutate(channelInput) }}>Search</Button>
			</Group>

			{
				Object.entries(channels).map(([channelId, videos]) => {
					return (
						<Stack key={channelId}>
							<Text>{channelId}</Text>
							<Group>
								{Object.entries(videos).map(([videoId, videoData]) => {
									return (
										<Card key={videoId}>
											<Card.Section>
												<Image src={videoData.thumbnail} />
											</Card.Section>
											<Text>{videoData.title}</Text>
										</Card>
									)
								})}
							</Group>
						</Stack>
					)
				})
			}
		</Stack>
	)
}

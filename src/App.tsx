import { Group, Stack } from '@mantine/core'
import Layout from '~/components/Layout'
import Video from '~/components/Video'
import { useYoutubeStore } from '~/state/useYoutubeStore'

export default function App() {
	const channels = useYoutubeStore(state => state.channels)

	return (
		<Layout>
			<Stack p='lg'>
				{
					Object.values(channels).map(channel => {
						return (
							<Group key={channel.id}>
								{Object.values(channel.videos).map(video => {
									return <Video key={video.id} channelId={channel.id} videoId={video.id} />
								})}
							</Group>
						)
					})
				}
			</Stack>
		</Layout>
	)
}

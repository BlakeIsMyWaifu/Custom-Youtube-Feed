import { Group, Stack, Title } from '@mantine/core'
import { useYoutubeStore, type YoutubeState } from '~/state/useYoutubeStore'
import Video, { type VideoProps } from './Video'

type CategoryProps = {
	category: YoutubeState['categories'][number]
}

export default function Category({ category }: CategoryProps) {
	const channels = useYoutubeStore(state => state.channels)

	const videos = category.items
		.flatMap(channelId => Object.values(channels[channelId].videos)
			.map<VideoProps>(video => {
				const { videos: _videos, ...channel } = channels[channelId]
				return ({
					channel,
					video
				})
			}))
		.sort((a, b) => a.video.publishedAt < b.video.publishedAt ? -1 : 1)

	return (
		<Stack p='md'>
			<Title order={2}>{category.id}</Title>

			<Group>
				{
					videos.map(({ channel, video }) => {
						return <Video key={video.id} channel={channel} video={video} />
					})
				}
			</Group>
		</Stack>
	)
}

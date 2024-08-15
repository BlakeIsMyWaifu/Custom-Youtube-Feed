import { Card, CloseButton, type ElementProps, Group, Image, type ImageProps, Stack, Text, UnstyledButton, type UnstyledButtonProps } from '@mantine/core'
import { forwardRef } from 'react'
import { useYoutubeStore } from '~/state/useYoutubeStore'

type VideoProps = {
	channelId: string
	videoId: string
}

type ImageButtonProps = UnstyledButtonProps & ImageProps & ElementProps<'button'>
const ImageButton = forwardRef<HTMLImageElement, ImageButtonProps>(function ImageButton(props, ref) {
	return <UnstyledButton {...props} ref={ref} component={Image} />
})

export default function Video({ channelId, videoId }: VideoProps) {
	const channel = useYoutubeStore(state => state.channels[channelId])
	const video = channel.videos[videoId]

	return (
		<Card w={360} shadow='sm' padding='xs' radius='md' withBorder>
			<Stack gap={0}>
				<Group justify='space-between'>
					<Text fw={700}>{channel.handle}</Text>
					<CloseButton />
				</Group>
				<Text lineClamp={1}>{video.title}</Text>
			</Stack>

			<Card.Section pt='sm'>
				<ImageButton
					src={video.thumbnail}
					onClick={() => window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank')?.focus()}
				/>
			</Card.Section>
		</Card>
	)
}

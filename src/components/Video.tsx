import { Card, CloseButton, type ElementProps, Group, Image, type ImageProps, Stack, Text, UnstyledButton, type UnstyledButtonProps } from '@mantine/core'
import { modals } from '@mantine/modals'
import { forwardRef } from 'react'
import { type Channel, useYoutubeStore, type Video } from '~/state/useYoutubeStore'

export type VideoProps = {
	channel: Omit<Channel, 'videos'>
	video: Video
}

type ImageButtonProps = UnstyledButtonProps & ImageProps & ElementProps<'button'>
const ImageButton = forwardRef<HTMLImageElement, ImageButtonProps>(function ImageButton(props, ref) {
	return <UnstyledButton {...props} ref={ref} component={Image} />
})

export default function Video({ channel, video }: VideoProps) {
	const watchVideo = useYoutubeStore(state => state.watchVideo)

	const watchVideoModal = () => modals.openConfirmModal({
		title: video.title,
		children: (
			<Text size='sm'>Please confirm the video has been fully watched</Text>
		),
		labels: { confirm: 'Confirm', cancel: 'Cancel' },
		onConfirm: () => watchVideo(channel.id, video.id)
	})

	return (
		<Card w={360} shadow='sm' padding='xs' radius='md' withBorder>
			<Stack gap={0}>
				<Group justify='space-between'>
					<Text fw={700}>{channel.title}</Text>
					<CloseButton onClick={watchVideoModal} />
				</Group>
				<Text lineClamp={1}>{video.title}</Text>
			</Stack>

			<Card.Section pt='sm'>
				<ImageButton
					src={video.thumbnail}
					onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank')?.focus()}
				/>
			</Card.Section>
		</Card>
	)
}

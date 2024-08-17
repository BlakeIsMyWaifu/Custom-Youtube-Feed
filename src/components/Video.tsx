import { Card, CloseButton, type ElementProps, Group, Image, type ImageProps, Stack, Text, UnstyledButton, type UnstyledButtonProps } from '@mantine/core'
import { forwardRef } from 'react'
import { type Channel, type Video } from '~/state/useYoutubeStore'

export type VideoProps = {
	channel: Omit<Channel, 'videos'>
	video: Video
}

type ImageButtonProps = UnstyledButtonProps & ImageProps & ElementProps<'button'>
const ImageButton = forwardRef<HTMLImageElement, ImageButtonProps>(function ImageButton(props, ref) {
	return <UnstyledButton {...props} ref={ref} component={Image} />
})

export default function Video({ channel, video }: VideoProps) {
	return (
		<Card w={360} shadow='sm' padding='xs' radius='md' withBorder>
			<Stack gap={0}>
				<Group justify='space-between'>
					<Text fw={700}>{channel.title}</Text>
					<CloseButton />
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

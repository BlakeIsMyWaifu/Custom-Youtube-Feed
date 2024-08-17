import { rem } from '@mantine/core'
import { useMap } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { useYoutubeStore } from '~/state/useYoutubeStore'
import fetchJson from '~/utils/fetchJson'

interface YoutubeResponse {
	etag: string
	kind: string
}

interface ChannelListResponse extends YoutubeResponse {
	items: [{ id: string } & YoutubeResponse]
}

interface PlaylistResponse extends YoutubeResponse {
	nextPageToken: string
	items: ChannelVideo[]
}

export interface ChannelVideo extends YoutubeResponse {
	snippet: {
		publishedAt: number
		title: string
		thumbnails: [ThumbnailData, ThumbnailData, ThumbnailData, ThumbnailData]
		resourceId: {
			kind: string
			videoId: string
		}
	}
}

export type ThumbnailData = {
	url: string
	width: number
	height: number
}

export default function useChannelQuery() {
	const FETCH_HISTORY_AMOUNT = 4

	const addChannel = useYoutubeStore(state => state.addChannel)
	const addVideo = useYoutubeStore(state => state.addVideo)

	const activeNotifications = useMap<string, string>()

	return useMutation({
		mutationFn: async (channelHandle: string) => {
			const channelList = await fetchJson<ChannelListResponse>(`https://yt.lemnoslife.com/channels?handle=@${channelHandle}`)
			const channelId = channelList.items[0].id
			addChannel(channelId, channelHandle)

			const formattedId = channelId.replace('UC', 'UULF')
			const playlist = await fetchJson<PlaylistResponse>(`https://yt.lemnoslife.com/playlistItems?part=snippet&playlistId=${formattedId}`)
			for (let i = 0; i < FETCH_HISTORY_AMOUNT; i++) {
				const videoData = playlist.items[i].snippet
				addVideo(channelId, videoData)
			}
		},
		onMutate: variable => {
			const notificationId = notifications.show({
				loading: true,
				color: 'green',
				title: `Importing videos from ${variable}`,
				message: 'This should only take a few seconds',
				autoClose: false,
				withCloseButton: false
			})
			activeNotifications.set(variable, notificationId)
		},
		onSuccess: (_data, variable) => {
			const id = activeNotifications.get(variable)
			notifications.update({
				id,
				color: 'teal',
				title: 'Success',
				message: `Videos from ${variable} loaded successfully`,
				icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
				loading: false,
				autoClose: 2500
			})
		},
		onError: (data, variable) => {
			console.error(data)
			const id = activeNotifications.get(variable)
			notifications.update({
				id,
				color: 'red',
				title: 'Failed',
				message: `Videos from ${variable} failed to load`,
				icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
				loading: false,
				autoClose: 2500
			})
		},
		onSettled: (_data, _error, variable) => {
			activeNotifications.delete(variable)
		}
	})
}

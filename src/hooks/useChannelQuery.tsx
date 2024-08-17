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

interface SearchResponse extends YoutubeResponse {
	nextPageToken: string
	items: SearchItem[]
}

interface SearchItem extends YoutubeResponse {
	id: YoutubeResponse
	snippet: {
		channelId: string
		title: string
		thumbnails: ThumbnailData[]
		channelTitle: string
		channelHandle: string
		timestamp: string
		duration: number
		views: number
		badges: string[]
		channelApproval: string
		channelThumbnails: ThumbnailData[]
		detailedMetadataSnippet: {
			text: string
			bold?: true
		}[]
		chapters: unknown[]
	}
}

interface PlaylistResponse extends YoutubeResponse {
	nextPageToken: string
	items: PlaylistItem[]
}

export interface PlaylistItem extends YoutubeResponse {
	snippet: {
		publishedAt: number
		title: string
		thumbnails: ThumbnailData[]
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
		mutationFn: async (searchValue: string) => {
			const search = await fetchJson<SearchResponse>(`https://yt.lemnoslife.com/search?part=snippet&q=${searchValue}`)
			const { snippet: { channelId, channelHandle, channelTitle } } = search.items[0]

			addChannel(channelId, channelHandle, channelTitle)

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
				title: `Searching for videos from ${variable}`,
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

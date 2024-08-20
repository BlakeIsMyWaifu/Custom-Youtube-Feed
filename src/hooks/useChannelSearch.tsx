import { rem } from '@mantine/core'
import { useMap } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { useYoutubeStore } from '~/state/useYoutubeStore'
import { type ThumbnailData, type YoutubeResponse } from '~/types/YoutubeResponse'
import fetchJson from '~/utils/fetchJson'

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

export default function useChannelSearch() {
	const channels = useYoutubeStore(state => state.channels)
	const addChannel = useYoutubeStore(state => state.addChannel)

	const activeNotifications = useMap<string, string>()

	return useMutation({
		mutationFn: async (searchValue: string) => {
			const search = await fetchJson<SearchResponse>(`https://yt.lemnoslife.com/search?part=snippet&q=${searchValue}`)
			const { snippet: { channelId, channelHandle, channelTitle } } = search.items.find(video => video.snippet.channelHandle.toLowerCase() === `@${searchValue.toLowerCase()}`) ?? search.items[0]

			if (Object.hasOwn(channels, channelId)) return

			addChannel(channelId, channelHandle, channelTitle)
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
		onError: (error, variable) => {
			console.error(error)
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

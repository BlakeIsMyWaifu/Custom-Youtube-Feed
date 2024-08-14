import { useMutation } from '@tanstack/react-query'
import { useYoutubeStore } from '~/state/useYoutubeStore'

type ChannelQueryResponse = {
	kind: string
	etag: string
	nextPageToken: string
	items: ChannelVideo[]
}

export type ChannelVideo = {
	kind: string
	etag: string
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

	return useMutation({
		mutationFn: async (channelId: string) => {
			addChannel(channelId)

			const formattedId = channelId.replace('UC', 'UULF')
			const response = await fetch(`https://yt.lemnoslife.com/playlistItems?part=snippet&playlistId=${formattedId}`)
			const channelData = await (response.json() as Promise<ChannelQueryResponse>)
			for (let i = 0; i < FETCH_HISTORY_AMOUNT; i++) {
				const videoData = channelData.items[i].snippet
				addVideo(channelId, videoData)
			}
		}
	})
}

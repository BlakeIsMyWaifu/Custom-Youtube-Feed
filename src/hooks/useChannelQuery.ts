import { useMutation } from '@tanstack/react-query'
import { useYoutubeStore } from '../state/useYoutubeStore'

type ChannelQueryResponse = {
	kind: string
	etag: string
	nextPageToken: string
	items: ChannelVideo[]
}

type ChannelVideo = {
	kind: string
	etag: string
	snippet: {
		publishedAt: number
		title: string
		thumbnails: {
			url: string
			width: number
			height: number
		}[]
		resourceId: {
			kind: string
			videoId: string
		}
	}
}

export default function useChannelQuery() {
	const addChannel = useYoutubeStore(state => state.addChannel)

	return useMutation({
		mutationFn: async (channelId: string) => {
			const formattedId = channelId.replace('UC', 'UULF')
			const response = await fetch(`https://yt.lemnoslife.com/playlistItems?part=snippet&playlistId=${formattedId}`)
			const channelData = await response.json() as Promise<ChannelQueryResponse>
			addChannel(channelId)
		}
	})
}

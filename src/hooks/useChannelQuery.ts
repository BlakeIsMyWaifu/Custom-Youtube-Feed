import { useMutation } from '@tanstack/react-query'
import { useYoutubeStore } from '~/state/useYoutubeStore'
import fetchJson from '~utils/fetchJson'

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

	return useMutation({
		mutationFn: async (channelHandle: string) => {
			const channelList = await fetchJson<ChannelListResponse>(`https://yt.lemnoslife.com/channels?&handle=@${channelHandle}`)
			const channelId = channelList.items[0].id

			addChannel(channelId)

			const formattedId = channelId.replace('UC', 'UULF')
			const playlist = await fetchJson<PlaylistResponse>(`https://yt.lemnoslife.com/playlistItems?part=snippet&playlistId=${formattedId}`)
			for (let i = 0; i < FETCH_HISTORY_AMOUNT; i++) {
				const videoData = playlist.items[i].snippet
				addVideo(channelId, videoData)
			}
		}
	})
}

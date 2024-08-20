import { useQueries } from '@tanstack/react-query'
import { useYoutubeStore } from '~/state/useYoutubeStore'
import { type ThumbnailData, type YoutubeResponse } from '~/types/YoutubeResponse'
import fetchJson from '~/utils/fetchJson'

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

export default function useChannelQuery() {
	const channels = useYoutubeStore(state => state.channels)

	const addVideo = useYoutubeStore(state => state.addVideo)
	const removeVideo = useYoutubeStore(state => state.removeVideo)

	return useQueries({
		queries: Object.values(channels).map(channel => {
			return {
				queryKey: ['channel', channel.id],
				queryFn: async () => {
					const FETCH_HISTORY_AMOUNT = 6

					const formattedId = channel.id.replace('UC', 'UULF')
					const playlist = await fetchJson<PlaylistResponse>(`https://yt.lemnoslife.com/playlistItems?part=snippet&playlistId=${formattedId}`)
					const latestVideos = playlist.items.slice(0, FETCH_HISTORY_AMOUNT)

					latestVideos.forEach(video => addVideo(channel.id, video.snippet))

					Object.values(channel.videos)
						.filter(video => video.watched)
						.forEach(video => {
							if (!latestVideos.find(item => item.snippet.resourceId.videoId === video.id)) {
								removeVideo(channel.id, video.id)
							}
						})

					return channel.id
				}
			}
		})
	})
}

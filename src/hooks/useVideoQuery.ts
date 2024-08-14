import { useMutation } from '@tanstack/react-query'
import { type ThumbnailData } from './useChannelQuery'

type VideoQueryResponse = {
	kind: string
	etag: string
	items: VideoData[]
	pageInfo: {
		totalResults: number
		resultsPerPage: number
	}
}

export type VideoData = {
	kind: string
	etag: string
	id: string
	snippet: {
		publishedAt: string
		channelId: string
		title: string
		description: string
		thumbnails: {
			default: ThumbnailData
			medium: ThumbnailData
			high: ThumbnailData
			standard: ThumbnailData
			maxres: ThumbnailData
		}
		channelTitle: string
		tags: string[]
		categoryId: string
		liveBroadcastContent: string
		localized: {
			title: string
			description: string
		}
		defaultAudioLanguage: string
	}
}

export default function useVideoQuery() {
	return useMutation({
		mutationFn: async (videoId: string) => {
			const response = await fetch(`https://yt.lemnoslife.com/noKey/videos?part=snippet&id=${videoId}`)
			return await (response.json() as Promise<VideoQueryResponse>)
		}
	})
}

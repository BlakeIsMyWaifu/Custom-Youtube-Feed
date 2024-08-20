import { type PlaylistItem } from '~/hooks/useChannelQuery'
import { createActionName, type Slice } from './storeTypes'
import { type YoutubeStore } from './useYoutubeStore'

export type YoutubeVideoActions = {
	watchVideo: (channelId: string, videoId: string) => void
	addVideo: (channelId: string, videoData: PlaylistItem['snippet']) => void
	removeVideo: (channelId: string, videoId: string) => void
}

const actionName = createActionName<YoutubeVideoActions>('youtube')

export const createYoutubeVideoActions: Slice<YoutubeStore, YoutubeVideoActions> = (set, get) => ({
	watchVideo: (channelId, videoId) => {
		set(state => ({
			channels: {
				...state.channels,
				[channelId]: {
					...state.channels[channelId],
					videos: {
						...state.channels[channelId].videos,
						[videoId]: {
							...state.channels[channelId].videos[videoId],
							watched: true
						}
					}
				}
			}
		}), ...actionName('watchVideo'))
	},

	addVideo: (channelId, videoData) => {
		if (Object.hasOwn(get().channels[channelId].videos, videoData.resourceId.videoId)) return

		set(state => ({
			channels: {
				...state.channels,
				[channelId]: {
					...state.channels[channelId],
					videos: {
						...state.channels[channelId].videos,
						[videoData.resourceId.videoId]: {
							id: videoData.resourceId.videoId,
							publishedAt: videoData.publishedAt,
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
							thumbnail: videoData.thumbnails.at(-1)!.url,
							title: videoData.title,
							watched: false
						}
					}
				}
			}
		}), ...actionName('addVideo'))
	},

	removeVideo: (channelId, videoId) => {
		const { [videoId]: _removedVideo, ...videos } = get().channels[channelId].videos

		set(state => ({
			channels: {
				...state.channels,
				[channelId]: {
					...state.channels[channelId],
					videos
				}
			}
		}), ...actionName('removeVideo'))
	}
})

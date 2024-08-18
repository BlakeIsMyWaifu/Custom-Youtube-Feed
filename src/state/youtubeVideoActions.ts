import { createActionName, type Slice } from './storeTypes'
import { type YoutubeStore } from './useYoutubeStore'

export type YoutubeVideoActions = {
	watchVideo: (channelId: string, videoId: string) => void
}

const actionName = createActionName<YoutubeVideoActions>('youtube')

export const createYoutubeVideoActions: Slice<YoutubeStore, YoutubeVideoActions> = (set, _get) => ({
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
	}
})

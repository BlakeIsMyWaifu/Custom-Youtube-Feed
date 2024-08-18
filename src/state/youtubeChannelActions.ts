import { type PlaylistItem } from '~/hooks/useChannelQuery'
import { createActionName, type Slice } from './storeTypes'
import { type YoutubeStore } from './useYoutubeStore'

export type YoutubeChannelActions = {
	addChannel: (channelId: string, channelHandle: string, channelTitle: string) => void
	addVideo: (channelId: string, videoData: PlaylistItem['snippet']) => void
	removeChannel: (channelId: string) => void
}

const actionName = createActionName<YoutubeChannelActions>('youtube')

export const createYoutubeChannelActions: Slice<YoutubeStore, YoutubeChannelActions> = (set, get) => ({
	addChannel: (channelId, channelHandle, channelTitle) => {
		if (!channelId) return

		set(state => ({
			channels: {
				...state.channels,
				[channelId]: {
					id: channelId,
					handle: channelHandle,
					title: channelTitle,
					videos: {}
				}
			}
		}), ...actionName('addChannel/channels'))

		const categories = structuredClone(get().categories)
		const uncategorisedIndex = categories.findIndex(category => category.id === 'Uncategorised')
		categories[uncategorisedIndex].items.push(channelId)

		set({ categories }, ...actionName('addChannel/category'))
	},

	addVideo: (channelId, videoData) => {
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

	removeChannel: channelId => {
		const categories = structuredClone(get().categories)
		const category = categories.find(category => category.items.includes(channelId))
		if (!category) return
		const channelIndex = category.items.findIndex(item => item === channelId)
		const updatedCategory = category.items.toSpliced(channelIndex, 1)
		const categoryIndex = categories.findIndex(searchCategory => searchCategory.id === category.id)
		categories[categoryIndex].items = updatedCategory
		set({ categories }, ...actionName('removeChannel/categories'))

		const channels = structuredClone(get().channels)
		// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
		delete channels[channelId]
		set({ channels }, ...actionName('removeChannel/channel'))
	}
})

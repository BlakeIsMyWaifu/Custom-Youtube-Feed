import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { type ChannelVideo } from '~/hooks/useChannelQuery'
import { createActionName, persistStoreName, type Slice } from './storeTypes'

type Channel = {
	id: string
	handle: string
	videos: Record<string, {
		id: string
		publishedAt: number
		thumbnail: string
		title: string
	}>
}

type YoutubeState = {
	channels: Record<string, Channel>
	categories: {
		id: string
		items: string[]
	}[]
}

const youtubeState: YoutubeState = {
	channels: {},
	categories: [
		{ id: 'Uncategorised', items: [] }
	]
}

type YoutubeAction = {
	addChannel: (channelId: string, channelHandle: string) => void
	addVideo: (channelId: string, videoData: ChannelVideo['snippet']) => void

	updateCategories: (categories: YoutubeState['categories']) => void
	addCategory: (category: string) => void
}

const actionName = createActionName<YoutubeAction>('youtube')

const createYoutubeAction: Slice<YoutubeStore, YoutubeAction> = (set, get) => ({
	addChannel: (channelId, channelHandle) => {
		set(state => ({
			channels: {
				...state.channels,
				[channelId]: {
					id: channelId,
					handle: channelHandle,
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
							thumbnail: videoData.thumbnails[3].url,
							title: videoData.title
						}
					}
				}
			}
		}), ...actionName('addVideo'))
	},

	updateCategories: categories => {
		set({ categories }, ...actionName('updateCategories'))
	},

	addCategory: category => {
		set(state => ({
			categories: [
				...state.categories,
				{ id: category, items: [] }
			]
		}), ...actionName('addCategory'))
	}
})

type YoutubeStore = YoutubeState & YoutubeAction

export const useYoutubeStore = create<YoutubeStore>()(
	devtools(
		persist((...a) => ({
			...youtubeState,
			...createYoutubeAction(...a)
		}), { name: persistStoreName('youtube') }),
		{ name: 'Youtube Store' })
)

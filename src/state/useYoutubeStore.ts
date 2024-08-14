import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { createActionName, persistStoreName, type Slice } from './storeTypes'

type ChannelId = string
type VideoId = string

type Video = {
	thumbnail: string
	title: string
	publishedAt: string
}

type YoutubeState = {
	channels: Record<ChannelId, Record<VideoId, Video>>
}

const youtubeState: YoutubeState = {
	channels: {}
}

type YoutubeAction = {
	addChannel: (channelId: string) => void
}

const actionName = createActionName<YoutubeAction>('youtube')

const createYoutubeAction: Slice<YoutubeStore, YoutubeAction> = (set, _get) => ({
	addChannel: channelId => {
		set(state => ({
			channels: {
				...state.channels,
				[channelId]: {}
			}
		}), ...actionName('addChannel'))
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

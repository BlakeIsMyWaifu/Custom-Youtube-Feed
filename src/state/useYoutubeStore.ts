import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { type ChannelVideo } from '~hooks/useChannelQuery'
import { createActionName, persistStoreName, type Slice } from './storeTypes'

type ChannelId = string
type VideoId = string

type Video = {
	publishedAt: number
	thumbnail: string
	title: string
}

type YoutubeState = {
	channels: Record<ChannelId, Record<VideoId, Video>>
}

const youtubeState: YoutubeState = {
	channels: {}
}

type YoutubeAction = {
	addChannel: (channelId: string) => void
	addVideo: (channelId: string, videoData: ChannelVideo['snippet']) => void
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
	},

	addVideo: (channelId, videoData) => {
		set(state => ({
			channels: {
				...state.channels,
				[channelId]: {
					...state.channels[channelId],
					[videoData.resourceId.videoId]: {
						publishedAt: videoData.publishedAt,
						thumbnail: videoData.thumbnails[3].url,
						title: videoData.title
					}
				}
			}
		}), ...actionName('addVideo'))
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

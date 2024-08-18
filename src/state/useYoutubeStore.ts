import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { persistStoreName } from './storeTypes'
import { createYoutubeCategoryActions, type YoutubeCategoryActions } from './youtubeCategoryActions'
import { createYoutubeChannelActions, type YoutubeChannelActions } from './youtubeChannelActions'
import { createYoutubeVideoActions, type YoutubeVideoActions } from './youtubeVideoActions'

export type Channel = {
	id: string
	handle: string
	title: string
	videos: Record<string, Video>
}

export type Video = {
	id: string
	publishedAt: number
	thumbnail: string
	title: string
	watched: boolean
}

export type YoutubeState = {
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

type YoutubeActions = YoutubeChannelActions & YoutubeCategoryActions & YoutubeVideoActions

export type YoutubeStore = YoutubeState & YoutubeActions

export const useYoutubeStore = create<YoutubeStore>()(
	devtools(
		persist((...a) => ({
			...youtubeState,
			...createYoutubeChannelActions(...a),
			...createYoutubeCategoryActions(...a),
			...createYoutubeVideoActions(...a)
		}), { name: persistStoreName('youtube') }),
		{ name: 'Youtube Store' })
)

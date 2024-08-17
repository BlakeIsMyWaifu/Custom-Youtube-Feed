import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { persistStoreName } from './storeTypes'
import { createYoutubeCategoryActions, type YoutubeCategoryActions } from './youtubeCategoryActions'
import { createYoutubeChannelActions, type YoutubeChannelActions } from './youtubeChannelActions'

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

type YoutubeActions = YoutubeChannelActions & YoutubeCategoryActions

export type YoutubeStore = YoutubeState & YoutubeActions

export const useYoutubeStore = create<YoutubeStore>()(
	devtools(
		persist((...a) => ({
			...youtubeState,
			...createYoutubeChannelActions(...a),
			...createYoutubeCategoryActions(...a)
		}), { name: persistStoreName('youtube') }),
		{ name: 'Youtube Store' })
)

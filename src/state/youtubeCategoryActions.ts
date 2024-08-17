import { createActionName, type Slice } from './storeTypes'
import { type YoutubeState, type YoutubeStore } from './useYoutubeStore'

export type YoutubeCategoryActions = {
	updateCategories: (categories: YoutubeState['categories']) => void
	addCategory: (category: string) => void
	removeCategory: (category: string) => void
}

const actionName = createActionName<YoutubeCategoryActions>('youtube')

export const createYoutubeCategoryActions: Slice<YoutubeStore, YoutubeCategoryActions> = (set, get) => ({
	updateCategories: categories => {
		set({ categories }, ...actionName('updateCategories'))
	},

	addCategory: category => {
		const { categories } = get()
		if (categories.find(searchCategory => searchCategory.id === category)) return

		set(state => ({
			categories: [
				...state.categories,
				{ id: category, items: [] }
			]
		}), ...actionName('addCategory'))
	},

	removeCategory: category => {
		if (category === 'Uncategorised') return

		const categories = structuredClone(get().categories)
		const categoryIndex = categories.findIndex(searchCategory => searchCategory.id === category)

		const channels = categories[categoryIndex].items
		const uncategorisedIndex = categories.findIndex(category => category.id === 'Uncategorised')
		categories[uncategorisedIndex].items = categories[uncategorisedIndex].items.concat(channels)

		categories.splice(categoryIndex, 1)

		set({ categories }, ...actionName('removeCategory'))
	}
})

import { type DropResult } from '@hello-pangea/dnd'
import { useCallback } from 'react'
import { useYoutubeStore } from '~/state/useYoutubeStore'

type DragData = {
	source: DropResult['source']
	sourceCategoryId: string
	destination: NonNullable<DropResult['destination']>
	destinationCategoryId: string
}

const reorder = <T>(list: T[], startIndex: number, endIndex: number) => {
	const result = Array.from(list)
	const [removed] = result.splice(startIndex, 1)
	result.splice(endIndex, 0, removed)
	return result
}

export default function useHandleDrag() {
	const categories = useYoutubeStore(state => state.categories)
	const updateCategories = useYoutubeStore(state => state.updateCategories)

	const handleSameCategoryItemDrag = useCallback(({ sourceCategoryId, source, destination }: DragData) => {
		const category = categories.find(category => category.id === sourceCategoryId)?.items
		if (!category) return

		const updatedOrder = reorder(
			category,
			source.index,
			destination.index
		)
		const updatedCategories = categories.map(category =>
			category.id === sourceCategoryId
				? { ...category, items: updatedOrder }
				: category
		)

		updateCategories(updatedCategories)
	}, [categories, updateCategories])

	const handleDifferentCategoryItemDrag = useCallback(({ sourceCategoryId, source, destination, destinationCategoryId }: DragData) => {
		const sourceOrder = categories.find(category => category.id === sourceCategoryId)?.items
		const destinationOrder = categories.find(category => category.id === destinationCategoryId)?.items

		if (!sourceOrder || !destinationOrder) return

		const [removed] = sourceOrder.splice(source.index, 1)
		destinationOrder.splice(destination.index, 0, removed)

		const updatedCategories = categories.map(category =>
			category.id === sourceCategoryId
				? { ...category, items: sourceOrder }
				: category.id === destinationCategoryId
					? { ...category, items: destinationOrder }
					: category
		)

		updateCategories(updatedCategories)
	}, [categories, updateCategories])

	const handleCategoryDrag = useCallback(({ source, destination }: DragData) => {
		const updatedCategories = reorder(
			categories,
			source.index,
			destination.index
		)

		updateCategories(updatedCategories)
	}, [categories, updateCategories])

	return useCallback(({ type, source, destination }: DropResult) => {
		if (!destination) return

		const sourceCategoryId = source.droppableId
		const destinationCategoryId = destination.droppableId

		const dragData: DragData = {
			source,
			sourceCategoryId,
			destination,
			destinationCategoryId
		}

		if (type === 'droppable-item') {
			(sourceCategoryId === destinationCategoryId ? handleSameCategoryItemDrag : handleDifferentCategoryItemDrag)(dragData)
		}

		if (type === 'droppable-category') {
			handleCategoryDrag(dragData)
		}
	}, [handleSameCategoryItemDrag, handleDifferentCategoryItemDrag, handleCategoryDrag])
}

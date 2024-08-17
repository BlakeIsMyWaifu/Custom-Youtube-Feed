import { DragDropContext } from '@hello-pangea/dnd'
import { Box, Text, Title } from '@mantine/core'
import useHandleDrag from '~/hooks/useHandleDrag'
import { useYoutubeStore } from '~/state/useYoutubeStore'
import Drag from './Drag'
import Drop from './Drop'

export default function CategoryList() {
	const categories = useYoutubeStore(state => state.categories)
	const channels = useYoutubeStore(state => state.channels)

	const handleDragEnd = useHandleDrag()

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<Drop id='droppable' type='droppable-category'>
				{categories.map((category, categoryIndex) => {
					return (
						<Drag
							key={category.id}
							id={category.id}
							index={categoryIndex}
							align='flex-start'
							m='xs'
							p='xs'
							bg='dark.5'
						>
							<Box>
								<Title order={2} h={36}>{category.id}</Title>

								<Drop key={category.id} id={category.id} type='droppable-item'>
									{category.items.map((item, index) => {
										return (
											<Drag
												key={item}
												id={item}
												index={index}
												align='center'
											>
												<Text h={36} size='xl'>{channels[item].handle}</Text>
											</Drag>
										)
									})}
								</Drop>
							</Box>
						</Drag>
					)
				})}
			</Drop>
		</DragDropContext>
	)
}

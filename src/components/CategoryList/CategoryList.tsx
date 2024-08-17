import { DragDropContext } from '@hello-pangea/dnd'
import { Box, CloseButton, Group, Text, Title } from '@mantine/core'
import useHandleDrag from '~/hooks/useHandleDrag'
import { useYoutubeStore } from '~/state/useYoutubeStore'
import Drag from './Drag'
import Drop from './Drop'

export default function CategoryList() {
	const categories = useYoutubeStore(state => state.categories)
	const channels = useYoutubeStore(state => state.channels)

	const removeCategory = useYoutubeStore(state => state.removeCategory)
	const removeChannel = useYoutubeStore(state => state.removeChannel)

	const handleDragEnd = useHandleDrag()

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<Drop id='droppable' type='droppable-category'>
				{categories.map((category, categoryIndex) => {
					return (
						<Group key={category.id} w='100%'>
							<Drag
								id={category.id}
								index={categoryIndex}
								m='xs'
								p='xs'
								bg='dark.5'
								style={{ maxWidth: '339px', borderRadius: 'var(--mantine-radius-md)' }}
							>
								<Box style={{ flex: 1 }}>
									<Group justify='space-between'>
										<Title order={2} h={36}>{category.id}</Title>
										{category.id !== 'Uncategorised' && <CloseButton onClick={() => removeCategory(category.id)} />}
									</Group>

									<Drop id={category.id} type='droppable-item'>
										{category.items.map((channelId, index) => {
											return (
												<Drag
													key={channelId}
													id={channelId}
													index={index}
													style={{ maxWidth: '285px' }}
												>
													<Group style={{ flex: 1 }} justify='space-between'>
														<Text h={36} size='xl'>{channels[channelId].handle}</Text>
														<CloseButton onClick={() => removeChannel(channelId)} />
													</Group>
												</Drag>
											)
										})}
									</Drop>
								</Box>
							</Drag>
						</Group>
					)
				})}
			</Drop>
		</DragDropContext>
	)
}

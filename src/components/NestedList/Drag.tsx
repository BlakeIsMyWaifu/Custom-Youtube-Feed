import { Draggable } from '@hello-pangea/dnd'
import { Group, type GroupProps, Stack } from '@mantine/core'
import { IconGripVertical } from '@tabler/icons-react'
import { type ReactNode } from 'react'

interface DragProps extends GroupProps {
	id: string
	index: number
	children: ReactNode
}

export default function Drag({ id, index, children, ...props }: DragProps) {
	return (
		<Draggable draggableId={id} index={index}>
			{(provided, _snapshot) => {
				return (
					<Group ref={provided.innerRef} gap='xs' {...provided.draggableProps} {...props}>
						<Stack h={36} justify='center' {...provided.dragHandleProps}>
							<IconGripVertical />
						</Stack>
						{children}
					</Group>
				)
			}}
		</Draggable>
	)
}

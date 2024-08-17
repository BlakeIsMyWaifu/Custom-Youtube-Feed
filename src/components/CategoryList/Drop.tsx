import { Droppable } from '@hello-pangea/dnd'
import { Box, type BoxProps } from '@mantine/core'
import { type ReactNode } from 'react'

interface DropProps extends BoxProps {
	id: string
	type: string
	children: ReactNode
}

export default function Drop({ id, type, ...props }: DropProps) {
	return (
		<Droppable droppableId={id} type={type}>
			{provided => {
				return (
					<Box ref={provided.innerRef} {...provided.droppableProps} {...props}>
						{props.children}
						{provided.placeholder}
					</Box>
				)
			}}
		</Droppable>
	)
}

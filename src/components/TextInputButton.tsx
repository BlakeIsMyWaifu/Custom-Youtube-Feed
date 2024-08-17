import { ActionIcon, rem, TextInput, type TextInputProps } from '@mantine/core'
import { type Icon, type IconProps } from '@tabler/icons-react'
import { useState } from 'react'

interface TextInputButtonProps extends TextInputProps {
	placeholder?: string
	submit: (inputValue: string) => void
	leftIcon?: Icon
	rightIcon: Icon
}

export default function TextInputButton({ placeholder, submit, leftIcon: LeftIcon, rightIcon: RightIcon, ...props }: TextInputButtonProps) {
	const [inputValue, setInputValue] = useState('')

	const submitWrapper = () => {
		submit(inputValue)
		setInputValue('')
	}

	const iconProps: IconProps = {
		style: {
			width: rem(18),
			height: rem(18)
		},
		stroke: 1.5
	}

	return (
		<TextInput
			radius='xl'
			size='md'
			placeholder={placeholder}
			rightSectionWidth={42}
			leftSection={LeftIcon ? <LeftIcon {...iconProps} /> : undefined}
			rightSection={(
				<ActionIcon
					size={32}
					radius='xl'
					color='red'
					variant='filled'
					onClick={submitWrapper}
				>
					<RightIcon {...iconProps} />
				</ActionIcon>
			)}
			value={inputValue}
			onChange={event => setInputValue(event.currentTarget.value)}
			onKeyDown={event => {
				if (event.key !== 'Enter') return
				submitWrapper()
			}}
			{...props}
		/>
	)
}

import { useState } from "react"

export default function TodoInput(props) {
	const { addTask } = props

	const [input, setInput] = useState("")
	function handleInput() {
		if (!input) return
		addTask(input)
		setInput("")
	}

	return (
		<header>
			<input
				type="text"
				value={input}
				onChange={(e) => {
					setInput(e.target.value)
				}}
				placeholder="Todo..."
			/>
			<button
				onClick={() => {
					handleInput()
				}}
			>
				Add
			</button>
		</header>
	)
}

import React, { useEffect } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

export default function TodoCard(props) {
	const {
		id,
		text,
		deleteTask,
		updateTask,
		markCompleted,
		unmarkCompleted,
		completedTasks,
	} = props

	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id })

	const style = {
		transition,
		transform: CSS.Transform.toString(transform),
	}

	const [isChecked, setIschecked] = React.useState(false)

	const handleCheckboxChange = () => {
		if (!isChecked) markCompleted(id)
		else unmarkCompleted(id)
		setIschecked(!isChecked)
	}

	useEffect(() => {
		if (completedTasks.includes(id)) setIschecked(true)
	}, [])

	function editTask() {
		const dragHandle = document.getElementById(id)
		const dragHandleBackup = dragHandle
		const input = document.createElement("input")
		input.type = "text"
		input.value = text
		input.className = "editing"
		input.onblur = () => {
			const newText = input.value
			if (newText && newText !== text) {
				updateTask(id, newText)
			}
			input.replaceWith(dragHandleBackup)
		}
		input.onkeydown = (e) => {
			if (e.key === "Enter") {
				input.blur()
			}
		}

		dragHandle.replaceWith(input)
		input.focus()
	}

	return (
		<div
			className={isChecked ? "completedItem" : "todoItem"}
			ref={setNodeRef}
			style={style}
		>
			<input
				type="checkbox"
				checked={isChecked}
				onChange={handleCheckboxChange}
			/>
			<div className="dragHandle" id={id} {...attributes} {...listeners}>
				{text}
			</div>

			<div className="actionsContainer">
				<button
					onClick={() => {
						editTask()
					}}
				>
					<i className="fa-solid fa-pen-to-square"></i>
				</button>
				<button
					onClick={() => {
						deleteTask(id)
					}}
				>
					<i className="fa-solid fa-trash"></i>
				</button>
			</div>
		</div>
	)
}

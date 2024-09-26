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
		const newText = prompt("Edit task", text) // TODO use in-line text input
		if (!newText) return
		updateTask(id, newText)
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
			<div className="dragHandle" {...attributes} {...listeners}>
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

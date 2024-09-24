import React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { DndContext } from "@dnd-kit/core"

export default function TodoCard(props) {
	const { id, text, deleteTask, updateTask } = props

	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id })

	const style = {
		transition,
		transform: CSS.Transform.toString(transform),
	}

	const [isChecked, setIschecked] = React.useState(false)

	const handleCheckboxChange = () => {
		setIschecked(!isChecked)
	}

	function editTask(id) {
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
						editTask(id)
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

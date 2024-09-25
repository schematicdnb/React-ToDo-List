import React from "react"
import Task from "./Task"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"

export default function List(props) {
	const { tasks, deleteTask, updateTask } = props

	return (
		<div className="main">
			<SortableContext items={tasks} strategy={verticalListSortingStrategy}>
				{tasks.map((task) => (
					<Task
						id={task.id}
						text={task.text}
						key={task.id}
						deleteTask={deleteTask}
						updateTask={updateTask}
					/>
				))}
			</SortableContext>
		</div>
	)
}

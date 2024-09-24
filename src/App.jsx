import TodoInput from "./components/TodoInput"
import List from "./components/List"
import { useState, useEffect } from "react"
import {
	closestCorners,
	DndContext,
	PointerSensor,
	TouchSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { useUniqueId } from "@dnd-kit/utilities"

function App() {
	const [tasks, setTasks] = useState([
		{ id: 1, text: "Learn React" },
		{ id: 2, text: "Learn Vue" },
		{ id: 3, text: "Learn Angular" },
	])

	function getTaskPos(id) {
		return tasks.findIndex((task) => task.id === id)
	}

	function handleDragEnd(event) {
		const { active, over } = event

		if (active.id === over.id) return

		setTasks((tasks) => {
			const originalPos = getTaskPos(active.id)
			const newPos = getTaskPos(over.id)
			return arrayMove(tasks, originalPos, newPos)
		})
	}

	const sensors = useSensors(
		useSensor(TouchSensor, {}),
		useSensor(PointerSensor, {})
	)

	function persistData() {
		if (!localStorage) return
		localStorage.setItem("tasks", JSON.stringify(tasks))
	}

	useEffect(() => {
		persistData()
	}, [tasks])

	function addTask(newTask) {
		const newList = [...tasks, { id: tasks.length + 1, text: newTask }]
		setTasks(newList)
	}

	// function deleteTask(index) {
	// 	const newTodoList = tasks.filter((todo, todoIndex) => {
	// 		return todoIndex !== index
	// 	})
	// 	persistData(newTodoList)
	// 	setTodos(newTodoList)
	// }

	// function editTask(index) {
	// 	const valueToBeEdited = tasks[index]
	// 	setTodoValue(valueToBeEdited)
	// 	handleDeleteTodo(index)
	// }

	useEffect(() => {
		if (!localStorage) return
		let localTasks = localStorage.getItem("tasks")
		if (!localTasks) return
		localTasks = JSON.parse(localTasks)
		setTasks(localTasks)
	}, [])

	return (
		<>
			<TodoInput addTask={addTask} />
			<DndContext
				collisionDetection={closestCorners}
				onDragEnd={handleDragEnd}
				sensors={sensors}
			>
				<List tasks={tasks} />
			</DndContext>
		</>
	)
}

export default App

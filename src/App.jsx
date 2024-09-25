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

function App() {
	const [tasks, setTasks] = useState([
		{ id: 1, text: "Learn React" },
		{ id: 2, text: "Make a To Do list" },
		{ id: 3, text: "Deploy to website portfolio" },
		{ id: 4, text: "Eat a sandwich" },
		{ id: 5, text: "Keyboard 'enter' task adding" },
		{ id: 6, text: "Implement in-line task editing" },
		{ id: 7, text: "Fix data persistence" },
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
		// console.log(localStorage.getItem("tasks"))
	}, [tasks])

	useEffect(() => {
		if (!localStorage) return
		let localTasks = localStorage.getItem("tasks")
		if (!localTasks) return
		localTasks = JSON.parse(localTasks)
		// console.log(localTasks)
		setTasks(localTasks)
	}, [])

	function addTask(newTask) {
		// Generate a new id that is not already in use
		const newId = (() => {
			const ids = tasks.map((task) => task.id).sort((a, b) => a - b)
			for (let i = 0; i < ids.length; i++) {
				if (ids[i] !== i + 1) {
					return i + 1
				}
			}
			return ids.length + 1
		})()
		const newList = [...tasks, { id: newId, text: newTask }]
		setTasks(newList)
	}

	function deleteTask(id) {
		setTasks((tasks) => tasks.filter((task) => task.id !== id))
	}

	function updateTask(id, newText) {
		setTasks((tasks) =>
			tasks.map((task) => (task.id === id ? { ...task, text: newText } : task))
		)
	}

	return (
		<>
			<h1>To Do ✅</h1>
			<TodoInput addTask={addTask} />
			<DndContext
				collisionDetection={closestCorners}
				onDragEnd={handleDragEnd}
				sensors={sensors}
			>
				<List tasks={tasks} deleteTask={deleteTask} updateTask={updateTask} />
			</DndContext>
		</>
	)
}

export default App

import TodoInput from "./components/TodoInput"
import List from "./components/List"
import { useState, useEffect, useCallback } from "react"
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
	const [tasks, setTasks] = useState([])

	const [completedTasks, setCompletedTasks] = useState([])

	function markCompleted(id) {
		const completed = [...completedTasks, id]
		setCompletedTasks(completed)
	}

	function unmarkCompleted(id) {
		const completed = completedTasks.filter((task) => task !== id)
		setCompletedTasks(completed)
	}

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

	function generateId() {
		// Generate a new id that is not already in use
		const ids = tasks.map((task) => task.id).sort((a, b) => a - b)
		for (let i = 0; i < ids.length; i++) {
			if (ids[i] !== i + 1) {
				return i + 1
			}
		}
		return ids.length + 1
	}

	function addTask(newTask) {
		const newId = generateId()
		const newList = [...tasks, { id: newId, text: newTask }]
		setTasks(newList)
	}

	function deleteTask(id) {
		setTasks((tasks) => tasks.filter((task) => task.id !== id))
		unmarkCompleted(id)
	}

	function updateTask(id, newText) {
		setTasks((tasks) =>
			tasks.map((task) => (task.id === id ? { ...task, text: newText } : task))
		)
	}

	function persistData() {
		if (!localStorage) return
		localStorage.setItem("tasks", JSON.stringify(tasks))
		localStorage.setItem("completedTasks", JSON.stringify(completedTasks))
	}

	useEffect(() => {
		if (!localStorage) return
		let localTasks = localStorage.getItem("tasks")
		if (!localTasks) return
		localTasks = JSON.parse(localTasks)
		setTasks(localTasks)
		let localCompletedTasks = localStorage.getItem("completedTasks")
		if (!localCompletedTasks) return
		localCompletedTasks = JSON.parse(localCompletedTasks)
		setCompletedTasks(localCompletedTasks)
	}, [])

	const [initialLoad, setInitialLoad] = useState(true)

	useEffect(() => {
		if (!initialLoad) {
			persistData()
		} else {
			setInitialLoad(false)
		}
	}, [tasks, completedTasks])

	return (
		<>
			<h1>To Do ✅</h1>
			<TodoInput addTask={addTask} />
			<DndContext
				collisionDetection={closestCorners}
				onDragEnd={handleDragEnd}
				sensors={sensors}
			>
				<List
					tasks={tasks}
					completedTasks={completedTasks}
					deleteTask={deleteTask}
					updateTask={updateTask}
					markCompleted={markCompleted}
					unmarkCompleted={unmarkCompleted}
				/>
			</DndContext>
		</>
	)
}

export default App

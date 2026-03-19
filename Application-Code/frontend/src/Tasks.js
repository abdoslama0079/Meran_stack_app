import { Component } from "react";
import {
    addTask,
    getTasks,
    updateTask,
    deleteTask,
} from "./services/taskServices";

class Tasks extends Component {
    state = { tasks: [], currentTask: "" };

    // 🔹 Load tasks when the page opens
    async componentDidMount() {
        try {
            const { data } = await getTasks();
            // In our Pretty Backend, data is wrapped in 'data.data'
            this.setState({ tasks: data.data || data });
        } catch (error) {
            console.error("❌ Failed to fetch tasks:", error);
        }
    }

    // 🔹 Handle typing in the input box
    handleChange = ({ currentTarget: input }) => {
        this.setState({ currentTask: input.value });
    };

    // 🔹 Create a new task
    handleSubmit = async (e) => {
        e.preventDefault();
        const { tasks, currentTask } = this.state;

        try {
            // FIX: Changed 'task' to 'title' to match our Backend Schema
            const { data } = await addTask({
                title: currentTask,
                createdBy: "Abdo" // Required by our Pretty Schema
            });

            // Add the new task to the list immediately
            this.setState({
                tasks: [...tasks, data.data],
                currentTask: ""
            });
            console.log("✅ Task added successfully");
        } catch (error) {
            console.error("❌ Error adding task:", error);
        }
    };

    // 🔹 Toggle Complete/Incomplete
    handleUpdate = async (id) => {
        const originalTasks = [...this.state.tasks];
        try {
            const tasks = [...originalTasks];
            const index = tasks.findIndex((t) => t._id === id);

            // Toggle the 'completed' status
            tasks[index] = { ...tasks[index], completed: !tasks[index].completed };
            this.setState({ tasks });

            // Sync with Backend
            await updateTask(id, { completed: tasks[index].completed });
        } catch (error) {
            // If server fails, revert back to the old state
            this.setState({ tasks: originalTasks });
            console.error("❌ Update failed, reverting state:", error);
        }
    };

    // 🔹 Delete a task
    handleDelete = async (id) => {
        const originalTasks = [...this.state.tasks];
        try {
            const tasks = originalTasks.filter((t) => t._id !== id);
            this.setState({ tasks });

            // Sync with Backend
            await deleteTask(id);
        } catch (error) {
            // If server fails, bring the task back
            this.setState({ tasks: originalTasks });
            console.error("❌ Delete failed, reverting state:", error);
        }
    };
}

export default Tasks;
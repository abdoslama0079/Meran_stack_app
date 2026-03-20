import { Component } from "react";
import {
    addTask,
    getTasks,
    updateTask,
    deleteTask,
} from "./services/taskServices";

class Tasks extends Component {
    state = { tasks: [], currentTask: "" };

    async componentDidMount() {
        try {
            const response = await getTasks();
            this.setState({ tasks: response.data.data || [] }); 
        } catch (error) {
            console.log(error);
        }
    }

    handleChange = ({ currentTarget: input }) => {
        this.setState({ currentTask: input.value });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const originalTasks = this.state.tasks;
        try {
            // Sends 'title' to match your database requirements
            const response = await addTask({ title: this.state.currentTask });
            const newTask = response.data.data;
            const tasks = [...originalTasks];
            tasks.push(newTask);
            this.setState({ tasks, currentTask: "" });
        } catch (error) {
            console.log("Validation Error: Ensure text is 3+ characters", error);
        }
    };

    handleUpdate = async (currentTaskId) => {
        const originalTasks = this.state.tasks;
        try {
            const tasks = [...originalTasks];
            const index = tasks.findIndex((task) => task._id === currentTaskId);
            tasks[index] = { ...tasks[index] };
            tasks[index].completed = !tasks[index].completed;
            this.setState({ tasks });
            await updateTask(currentTaskId, {
                completed: tasks[index].completed,
            });
        } catch (error) {
            this.setState({ tasks: originalTasks });
        }
    };

    handleDelete = async (currentTaskId) => {
        const originalTasks = this.state.tasks;
        try {
            const tasks = originalTasks.filter(
                (task) => task._id !== currentTaskId
            );
            this.setState({ tasks });
            await deleteTask(currentTaskId);
        } catch (error) {
            this.setState({ tasks: originalTasks });
        }
    };
}

export default Tasks;

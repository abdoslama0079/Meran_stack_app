import { Component } from "react";
import {
  addTask,
  getTasks,
  updateTask,
  deleteTask,
  markTaskCompleted,
  addTagToTask,
  getOverdueTasks,
} from "./services/taskServices";
import { Paper, Button, Checkbox, Typography, TextField } from "@material-ui/core";
import "./App.css";

class Tasks extends Component {
  state = {
    tasks: [],
    currentTask: "",
    loading: true,
    error: null,
    filter: "",
  };

  async componentDidMount() {
    try {
      const { data } = await getTasks();
      this.setState({ tasks: data.data || [], loading: false });
    } catch (error) {
      console.error(error);
      this.setState({ error: "Failed to load tasks", loading: false });
    }
  }

  handleChange = ({ currentTarget: input }) => {
    this.setState({ currentTask: input.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const originalTasks = this.state.tasks;
    try {
      const { data } = await addTask({ title: this.state.currentTask });
      const tasks = [...originalTasks, data];
      this.setState({ tasks, currentTask: "" });
    } catch (error) {
      console.error(error);
      this.setState({ error: "Failed to add task" });
    }
  };

  handleUpdate = async (taskId) => {
    const originalTasks = this.state.tasks;
    try {
      const tasks = [...originalTasks];
      const index = tasks.findIndex((task) => task._id === taskId);
      tasks[index] = { ...tasks[index], completed: !tasks[index].completed };
      this.setState({ tasks });
      await updateTask(taskId, { completed: tasks[index].completed });
    } catch (error) {
      this.setState({ tasks: originalTasks, error: "Failed to update task" });
    }
  };

  handleDelete = async (taskId) => {
    const originalTasks = this.state.tasks;
    try {
      const tasks = originalTasks.filter((task) => task._id !== taskId);
      this.setState({ tasks });
      await deleteTask(taskId);
    } catch (error) {
      this.setState({ tasks: originalTasks, error: "Failed to delete task" });
    }
  };

  handleFilterChange = ({ currentTarget: input }) => {
    this.setState({ filter: input.value });
  };

  renderTaskCard(task) {
    return (
      <Paper key={task._id} className="task-item fade-in" elevation={3}>
        <Checkbox
          checked={task.completed}
          onClick={() => this.handleUpdate(task._id)}
          color="primary"
        />
        <div className={task.completed ? "task-text completed" : "task-text"}>
          <Typography variant="subtitle1">{task.title}</Typography>
          {task.description && (
            <Typography variant="body2" color="textSecondary">
              {task.description}
            </Typography>
          )}
          {task.priority && (
            <span className={`priority-${task.priority}`}>
              {task.priority.toUpperCase()}
            </span>
          )}
          {task.dueDate && (
            <Typography variant="caption" color="textSecondary">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </Typography>
          )}
        </div>
        <Button
          onClick={() => this.handleDelete(task._id)}
          color="secondary"
          variant="outlined"
          className="delete-task-btn"
        >
          Delete
        </Button>
      </Paper>
    );
  }

  render() {
    const { tasks, currentTask, loading, error, filter } = this.state;

    if (loading) {
      return (
        <div className="main-content">
          <Typography variant="h6">Loading tasks...</Typography>
        </div>
      );
    }

    const filteredTasks = tasks.filter((task) =>
      task.title.toLowerCase().includes(filter.toLowerCase())
    );

    return (
      <div className="main-content">
        <Paper elevation={6} className="todo-container">
          {/* Task Form */}
          <form onSubmit={this.handleSubmit} className="task-form">
            <TextField
              variant="outlined"
              size="small"
              className="task-input"
              value={currentTask}
              required
              onChange={this.handleChange}
              placeholder="Add New TO-DO"
            />
            <Button
              className="add-task-btn"
              color="primary"
              variant="contained"
              type="submit"
            >
              Add Task
            </Button>
          </form>

          {/* Filter */}
          <TextField
            variant="outlined"
            size="small"
            className="task-input mb-4"
            value={filter}
            onChange={this.handleFilterChange}
            placeholder="Search tasks..."
          />

          {/* Error */}
          {error && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}

          {/* Task List */}
          <div className="tasks-list">
            {filteredTasks.length === 0 ? (
              <Typography
                variant="body1"
                color="textSecondary"
                align="center"
                style={{ marginTop: "20px" }}
              >
                No tasks found. Try adding one!
              </Typography>
            ) : (
              filteredTasks.map((task) => this.renderTaskCard(task))
            )}
          </div>
        </Paper>
      </div>
    );
  }
}

export default Tasks;

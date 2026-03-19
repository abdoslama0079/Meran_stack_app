import React from "react";
import Tasks from "./Tasks";
import {
    Paper,
    TextField,
    Checkbox,
    Button,
    AppBar,
    Toolbar,
    Typography,
    Container
} from "@material-ui/core";
import "./App.css";

class App extends Tasks {
    state = { tasks: [], currentTask: "" };

    render() {
        const { tasks, currentTask } = this.state;

        return (
            <div className="app">
                {/* 🔹 Modern Navbar */}
                <AppBar position="static" className="navbar">
                    <Toolbar>
                        <Typography variant="h6" className="navbar-title">
                            ✨ My To-Do App
                        </Typography>
                    </Toolbar>
                </AppBar>

                {/* 🔹 Main Content Area */}
                <Container className="main-content">
                    <Paper elevation={6} className="todo-container">

                        {/* Task Input Form */}
                        <form onSubmit={this.handleSubmit} className="task-form">
                            <TextField
                                variant="outlined"
                                size="small"
                                className="task-input"
                                value={currentTask}
                                required={true}
                                onChange={this.handleChange}
                                placeholder="What needs to be done?"
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

                        {/* Scrollable Task List */}
                        <div className="tasks-list">
                            {tasks.length === 0 ? (
                                <Typography align="center" color="textSecondary">
                                    No tasks yet. Enjoy your day! ☕
                                </Typography>
                            ) : (
                                tasks.map((task) => (
                                    <Paper key={task._id} className="task-item" elevation={2}>
                                        <Checkbox
                                            checked={task.completed}
                                            onClick={() => this.handleUpdate(task._id)}
                                            color="primary"
                                        />
                                        <div className={task.completed ? "task-text completed" : "task-text"}>
                                            {/* 🔹 Fixed: Changed .task to .title to match Backend */}
                                            {task.title}
                                        </div>
                                        <Button
                                            onClick={() => this.handleDelete(task._id)}
                                            color="secondary"
                                            variant="outlined"
                                            className="delete-task-btn"
                                            size="small"
                                        >
                                            Delete
                                        </Button>
                                    </Paper>
                                ))
                            )}
                        </div>
                    </Paper>
                </Container>

                {/* 🔹 Simple Footer */}
                <footer className="app-footer">
                    <Typography variant="body2">
                        © 2026 My To-Do App — Running on Azure Cloud
                    </Typography>
                </footer>
            </div>
        );
    }
}

export default App;
import React from "react";
import Tasks from "./Tasks";
import { 
    Paper, 
    TextField, 
    Checkbox, 
    Button, 
    Typography, 
    Container, 
    List, 
    ListItem, 
    ListItemText, 
    ListItemIcon, 
    ListItemSecondaryAction,
    Divider,
    Box
} from "@material-ui/core";
import "./App.css";

class App extends Tasks {
    render() {
        const { tasks, currentTask } = this.state;

        return (
            <Container maxWidth="sm" className="app-container">
                <Paper elevation={4} className="todo-card">
                    <Box p={4}>
                        <Box mb={3} textAlign="center">
                            <Typography variant="h4" component="h1" className="app-title">
                                Task Manager Pro
                            </Typography>
                        </Box>

                        <form onSubmit={this.handleSubmit} className="task-form">
                            <TextField
                                variant="outlined"
                                fullWidth
                                label="What needs to be done?"
                                helperText="Minimum 3 characters"
                                value={currentTask}
                                required
                                onChange={this.handleChange}
                                className="task-input"
                            />
                            <Button 
                                type="submit" 
                                variant="contained" 
                                color="primary" 
                                className="add-btn"
                                style={{ marginTop: '10px', height: '56px' }}
                                fullWidth
                            >
                                Add Task
                            </Button>
                        </form>

                        <Box mt={4}>
                            <Typography variant="h6" gutterBottom>
                                Your Tasks ({Array.isArray(tasks) ? tasks.length : 0})
                            </Typography>
                            <Divider />
                            
                            <List className="tasks-list">
                                {Array.isArray(tasks) && tasks.length > 0 ? (
                                    tasks.map((task) => (
                                        <ListItem key={task._id} divider className="task-item">
                                            <ListItemIcon>
                                                <Checkbox
                                                    edge="start"
                                                    checked={task.completed}
                                                    color="primary"
                                                    onClick={() => this.handleUpdate(task._id)}
                                                />
                                            </ListItemIcon>
                                            <ListItemText 
                                                primary={task.title} 
                                                style={{ 
                                                    textDecoration: task.completed ? 'line-through' : 'none', 
                                                    color: task.completed ? '#aaa' : '#333' 
                                                }}
                                            />
                                            <ListItemSecondaryAction>
                                                <Button 
                                                    onClick={() => this.handleDelete(task._id)}
                                                    color="secondary"
                                                    size="small"
                                                >
                                                    Delete
                                                </Button>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    ))
                                ) : (
                                    <Box py={3} textAlign="center">
                                        <Typography color="textSecondary">No tasks found. Start by adding one!</Typography>
                                    </Box>
                                )}
                            </List>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        );
    }
}

export default App;

import React from "react";
import Tasks from "./Tasks";
import { 
    Paper, 
    TextField, 
    Checkbox, 
    Button, 
    Typography, 
    Container, 
    IconButton, 
    List, 
    ListItem, 
    ListItemText, 
    ListItemIcon, 
    ListItemSecondaryAction,
    Divider,
    Box
} from "@material-ui/core";
import { DeleteOutline, Add as AddIcon, AssignmentTurnedIn } from "@material-ui/icons";
import "./App.css";

class App extends Tasks {
    render() {
        // We use task.title because your backend requires 'title'
        const { tasks, currentTask } = this.state;

        return (
            <Container maxWidth="sm" className="app-container">
                <Paper elevation={4} className="todo-card">
                    <Box p={4}>
                        <Box display="flex" alignItems="center" mb={3} justifyContent="center">
                            <AssignmentTurnedIn color="primary" style={{ fontSize: 40, marginRight: 10 }} />
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
                                startIcon={<AddIcon />}
                                className="add-btn"
                                style={{ marginTop: '10px', height: '56px' }}
                                fullWidth
                            >
                                Create Task
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
                                                    tabIndex={-1}
                                                    disableRipple
                                                    color="primary"
                                                    onClick={() => this.handleUpdate(task._id)}
                                                />
                                            </ListItemIcon>
                                            <ListItemText 
                                                primary={task.title} // Matches backend schema
                                                className={task.completed ? "task-text-completed" : ""}
                                                style={{ textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? '#aaa' : '#333' }}
                                            />
                                            <ListItemSecondaryAction>
                                                <IconButton 
                                                    edge="end" 
                                                    aria-label="delete" 
                                                    onClick={() => this.handleDelete(task._id)}
                                                    color="secondary"
                                                >
                                                    <DeleteOutline />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    ))
                                ) : (
                                    <Box py={3} textAlign="center">
                                        <Typography color="textSecondary">No tasks found. Start by adding one above!</Typography>
                                    </Box>
                                )}
                            </List>
                        </Box>
                    </Box>
                </Paper>
                <Typography variant="caption" align="center" display="block" style={{ marginTop: 20, color: '#666' }}>
                    Connected to: {window.location.hostname} | Env: Production
                </Typography>
            </Container>
        );
    }
}

export default App;

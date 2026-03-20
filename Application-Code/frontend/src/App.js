/* Professional MERN Stack Theme */
body {
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif;
    /* Professional blue-purple gradient background */
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
}

.app-container {
    padding-top: 50px;
    padding-bottom: 50px;
}

.todo-card {
    border-radius: 15px !important; /* Rounded professional corners */
    background-color: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(10px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.3) !important;
}

.app-title {
    font-weight: 700 !important;
    color: #4a148c;
    letter-spacing: 1px;
}

/* Form Styling */
.task-form {
    display: flex;
    flex-direction: column; /* Stacked for a cleaner mobile-pro look */
    gap: 15px;
    margin-bottom: 25px;
}

.task-input .MuiOutlinedInput-root {
    background-color: #fcfcfc;
}

.add-btn {
    font-weight: bold !important;
    padding: 12px !important;
    text-transform: none !important;
    font-size: 1.1rem !important;
    transition: all 0.3s ease !important;
}

.add-btn:hover {
    background-color: #311b92 !important;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2) !important;
}

/* Tasks List Styling */
.tasks-list {
    max-height: 400px;
    overflow-y: auto; /* Scrollable if you have many tasks */
    padding-right: 5px;
}

/* Custom scrollbar for pro look */
.tasks-list::-webkit-scrollbar {
    width: 6px;
}
.tasks-list::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 10px;
}

.task-item {
    transition: background-color 0.2s ease;
    border-radius: 8px !important;
    margin-bottom: 8px !important;
}

.task-item:hover {
    background-color: #f5f5f5;
}

.task-text-completed {
    font-style: italic;
    transition: all 0.3s ease;
}

/* Animation for adding/removing items */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

.task-item {
    animation: fadeIn 0.3s ease forwards;
}

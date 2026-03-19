import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

// 🔹 Material-UI Theme Tools
import { ThemeProvider, createTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

/**
 * 🔹 Error Boundary
 * This prevents the whole app from "disappearing" if
 * the backend sends bad data.
 */
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="app-wrapper">
          <div style={{ color: 'white', textAlign: 'center' }}>
            <h1>Something went wrong 😢</h1>
            <p>Please refresh the page or check your VM connection.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// 🔹 Professional Theme Configuration
const theme = createTheme({
  palette: {
    primary: {
      main: "#4f46e5", // Match our Indigo CSS
    },
    secondary: {
      main: "#ef4444", // Clean Red for Delete buttons
    },
    background: {
      default: "#f8fafc",
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      {/* CssBaseline fixes browser differences in spacing */}
      <CssBaseline />
      <ErrorBoundary>
        <div className="app-wrapper">
          <App />
        </div>
      </ErrorBoundary>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
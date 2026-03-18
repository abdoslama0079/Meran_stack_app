import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

// 🔹 Material-UI Theme
import { ThemeProvider, createTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

// 🔹 Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("❌ Error caught by boundary:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="app-wrapper">
          <h1>Something went wrong 😢</h1>
          <p>Please refresh the page or try again later.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// 🔹 Loading Splash
function SplashScreen() {
  return (
    <div className="app-wrapper fade-in">
      <h1 className="text-center">✨ Loading My To-Do App...</h1>
    </div>
  );
}

// 🔹 Theme setup
const theme = createTheme({
  palette: {
    primary: {
      main: "#4f46e5",
    },
    secondary: {
      main: "#ef4444",
    },
    background: {
      default: "#f4f4f4",
    },
  },
  typography: {
    fontFamily: "Inter, Roboto, sans-serif",
    h1: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
});

// 🔹 Root render
ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <div className="app-wrapper">
          {/* Splash screen could be conditionally rendered here */}
          <App />
        </div>
      </ErrorBoundary>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

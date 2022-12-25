import { ThemeProvider } from "@mui/material";
import AppRoutes from "./routes/routes";
import { theme } from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;

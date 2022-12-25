import { CircularProgress, Box } from "@mui/material";

const AppLoader: React.FC = () => {
  return (
    <Box height="100vh" display="flex" justifyContent="center" alignItems="center">
      <CircularProgress color="inherit" />
    </Box>
  );
};

export default AppLoader;

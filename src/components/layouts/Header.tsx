import {
  AppBar,
  Box,
  Toolbar,
  Typography,
} from "@mui/material";

const Header:React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1,height: 64 }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sensible
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header
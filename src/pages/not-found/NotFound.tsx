import { Box, Typography } from "@mui/material";
import _ from "lodash";
import React from "react";

const NotFound: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#eaeaea",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        boxShadow={2}
        padding={4}
        display="flex"
        justifyContent="center"
        alignItems="center"
        bgcolor="#fff"
        minWidth={300}
      >
        <Box>
          <Typography variant="h4" textAlign="center" color="red">
            Not Found
          </Typography>
          <Typography variant="subtitle1">This page not found</Typography>
        </Box>
      </Box>
    </div>
  );
};

export default NotFound;

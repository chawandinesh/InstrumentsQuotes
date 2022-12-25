import { Box, Container } from "@mui/material";
import React from "react";
import Header from "./Header";

interface ILayout {
  children: React.ReactElement;
}

const Layout: React.FC<ILayout> = ({ children }) => {
  return (
    <>
      <Header />
      <Container maxWidth="xl">
        <Box p={3}>{children}</Box>
      </Container>
    </>
  );
};

export default Layout;

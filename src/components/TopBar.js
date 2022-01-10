import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import { useHistory } from "react-router-dom";

const TopBar = () => {
  const history = useHistory();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            data-testid="top-bar-home-icon-button"
            size="large"
            edge="start"
            color="inherit"
            aria-label="home"
            sx={{ mr: 2 }}
            onClick={() => history.push("/")}
          >
            <HomeIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Reflexiones de sofá
          </Typography>
          <Button
            color="inherit"
            data-testid="top-bar-login-button"
            onClick={() => history.push("/login")}
          >
            Login
          </Button>
          <Button
            style={{
              backgroundColor: "#dfe3e8"
            }}
            color="primary"
            variant="outlined"
            data-testid="top-bar-sign-up-button"
            onClick={() => history.push("/sign-up")}
          >
            Sign up
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default TopBar;

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useState } from "react";

const REGISTRARION_SUCCESS = "USER_CREATED";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      <Link color="inherit" href="/">
        Reflexiones de Sofá
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

const Signup = () => {
  const history = useHistory();
  const [errorMessage, setErrorMessage] = useState("");
  const [usernameInputErrorMessage, setUsernameInputErrorMessage] =
    useState("");
  const [passwordInputErrorMessage, setPasswordInputErrorMessage] =
    useState("");

  const validateRegistrartionUsername = (username) => {
    username
      ? setUsernameInputErrorMessage("")
      : setUsernameInputErrorMessage("Username cannot be empty");
  };
  const validateRegistrarionPassword = (password) => {
    password.length < 8
      ? setPasswordInputErrorMessage(
          "Password must be at least 8 characters long"
        )
      : setPasswordInputErrorMessage("");
  };

  const submitForm = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const username = data.get("username");
    const password = data.get("password");

    validateRegistrartionUsername(username);
    validateRegistrarionPassword(password);

    if (!username || !password) {
      setErrorMessage("");
      return;
    }

    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/account/register`, {
        username,
        password,
      })
      .then((response) => {
        response.data === REGISTRARION_SUCCESS
          ? history.push(`/user/${username}`)
          : setErrorMessage(`Cannot register the user: ${response.data}`);
      })
      .catch((error) => {
        try {
          setErrorMessage(
            `Something unexpected happened. ERROR ${error.response.status}`
          );
        } catch (err) {
          setErrorMessage("Something unexpected happened. Try again later.");
        }
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Create an account
          </Typography>
          <Box component="form" onSubmit={submitForm} noValidate sx={{ mt: 1 }}>
            <TextField
              error={!!usernameInputErrorMessage}
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              helperText={usernameInputErrorMessage}
            />
            <TextField
              error={!!passwordInputErrorMessage}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              helperText={passwordInputErrorMessage}
            />
            {errorMessage && (
              <Alert
                data-testid="sign-up-error-alert"
                severity="error"
                onClose={() => {
                  setErrorMessage("");
                }}
              >
                {errorMessage}
              </Alert>
            )}
            <Button
              data-testid="register-button"
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>
            <Grid container>
              <Grid item xs></Grid>
              <Grid item>
                <Link
                  data-testid="sign-up-redirect-login"
                  href="/login"
                  variant="body2"
                >
                  {"Already have an account? Log in"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
};

export default Signup;

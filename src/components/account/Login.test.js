import { render, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import { act } from "react-dom/test-utils";
import Login from "./Login";

jest.mock("axios");

test("Display error when sign in button is clicked with empty username.", () => {
  const { getByTestId } = render(<Login />);

  let usernameHelperText = document.querySelector("[id=username-helper-text]");
  expect(usernameHelperText).not.toBeInTheDocument();

  fireEvent.click(getByTestId("sign-in-button"));

  usernameHelperText = document.querySelector("[id=username-helper-text]");
  expect(usernameHelperText).toBeInTheDocument();
  expect(usernameHelperText.textContent).toBe("Username cannot be empty");
});

test("Display error when sign in button is clicked with empty password.", () => {
  const { getByTestId } = render(<Login />);

  let passwordHelperText = document.querySelector("[id=password-helper-text]");
  expect(passwordHelperText).not.toBeInTheDocument();

  fireEvent.click(getByTestId("sign-in-button"));

  passwordHelperText = document.querySelector("[id=password-helper-text]");
  expect(passwordHelperText).toBeInTheDocument();
  expect(passwordHelperText.textContent).toBe("Password cannot be empty");
});

test("Display error alert when the user cannot be authenticated.", async () => {
  const { getByTestId } = render(<Login />);

  axios.get.mockImplementationOnce(() =>
    Promise.reject({ response: { status: 401 } })
  );

  let username = document.querySelector("[id=username]");
  let password = document.querySelector("[id=password]");
  expect(username.value).toBe("");
  expect(password.value).toBe("");

  let usernameHelperText = document.querySelector("[id=username-helper-text]");
  let passwordHelperText = document.querySelector("[id=password-helper-text]");
  expect(usernameHelperText).not.toBeInTheDocument();
  expect(passwordHelperText).not.toBeInTheDocument();

  act(() => {
    fireEvent.change(username, { target: { value: "username" } });
    fireEvent.change(password, { target: { value: "password" } });
    fireEvent.click(getByTestId("sign-in-button"));
  });

  usernameHelperText = document.querySelector("[id=username-helper-text]");
  passwordHelperText = document.querySelector("[id=password-helper-text]");
  expect(usernameHelperText).not.toBeInTheDocument();
  expect(passwordHelperText).not.toBeInTheDocument();

  let errorAlert = await waitFor(() => getByTestId("login-error-alert"));
  expect(errorAlert).toBeInTheDocument();
  expect(errorAlert.textContent).toBe("Incorrect username or password.");
});

// test("Display error alert when response status is not 200 nor 401.", () => {
//     render(<Login />);
// });

// test("Close error alert when click on exit", () => {
//     render(<Login />);
// });

// test("Redirect to users/{user} when user authenticated.", () => {
//     render(<Login />);
// });

// test("Redirect to sign up page when clicked in the link.", () => {
//    axios.get.mockResolvedValue(response);
//     render(<Login />);

// });

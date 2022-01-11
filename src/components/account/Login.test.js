import { render, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import Login from "./Login";

jest.mock("axios");

const mockHistoryPush = jest.fn();
jest.mock("react-router-dom", () => ({
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

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

test("Do not display text field error if username and password are not empty.", async () => {
  const { getByTestId } = render(<Login />);

  axios.get.mockImplementationOnce(() => Promise.reject({ response: {} }));

  let username = document.querySelector("[id=username]");
  let password = document.querySelector("[id=password]");
  expect(username.value).toBe("");
  expect(password.value).toBe("");

  let usernameHelperText = document.querySelector("[id=username-helper-text]");
  let passwordHelperText = document.querySelector("[id=password-helper-text]");
  expect(usernameHelperText).not.toBeInTheDocument();
  expect(passwordHelperText).not.toBeInTheDocument();

  fireEvent.change(username, { target: { value: "username" } });
  fireEvent.change(password, { target: { value: "password" } });
  fireEvent.click(getByTestId("sign-in-button"));

  usernameHelperText = document.querySelector("[id=username-helper-text]");
  passwordHelperText = document.querySelector("[id=password-helper-text]");
  expect(usernameHelperText).not.toBeInTheDocument();
  expect(passwordHelperText).not.toBeInTheDocument();
});

test("Display error alert when the user cannot be authenticated (Error 401).", async () => {
  const { getByTestId } = render(<Login />);

  axios.get.mockImplementationOnce(() =>
    Promise.reject({ response: { status: 401 } })
  );

  let username = document.querySelector("[id=username]");
  let password = document.querySelector("[id=password]");

  fireEvent.change(username, { target: { value: "username" } });
  fireEvent.change(password, { target: { value: "password" } });
  fireEvent.click(getByTestId("sign-in-button"));

  let errorAlert = await waitFor(() => getByTestId("login-error-alert"));
  expect(errorAlert).toBeInTheDocument();
  expect(errorAlert.textContent).toBe("Incorrect username or password.");
});

test("Display error alert when response status is not 200 nor 401.", async () => {
  const { getByTestId } = render(<Login />);

  const status = 500;
  axios.get.mockImplementationOnce(() =>
    Promise.reject({ response: { status } })
  );

  let username = document.querySelector("[id=username]");
  let password = document.querySelector("[id=password]");

  fireEvent.change(username, { target: { value: "username" } });
  fireEvent.change(password, { target: { value: "password" } });
  fireEvent.click(getByTestId("sign-in-button"));

  let errorAlert = await waitFor(() => getByTestId("login-error-alert"));
  expect(errorAlert).toBeInTheDocument();
  expect(errorAlert.textContent).toBe(
    `Something unexpected happened. ERROR ${status}`
  );
});

test("Display error alert when there is no response status.", async () => {
  const { getByTestId } = render(<Login />);

  axios.get.mockImplementationOnce(() =>
    Promise.reject("This error has no response status")
  );

  let username = document.querySelector("[id=username]");
  let password = document.querySelector("[id=password]");

  fireEvent.change(username, { target: { value: "username" } });
  fireEvent.change(password, { target: { value: "password" } });
  fireEvent.click(getByTestId("sign-in-button"));

  let errorAlert = await waitFor(() => getByTestId("login-error-alert"));
  expect(errorAlert).toBeInTheDocument();
  expect(errorAlert.textContent).toBe(
    "Something unexpected happened. Try again later."
  );
});

test("Close error alert when click on the close icon.", async () => {
  const { getByTestId } = render(<Login />);

  axios.get.mockImplementationOnce(() => Promise.reject("Some error"));

  let username = document.querySelector("[id=username]");
  let password = document.querySelector("[id=password]");

  fireEvent.change(username, { target: { value: "username" } });
  fireEvent.change(password, { target: { value: "password" } });
  fireEvent.click(getByTestId("sign-in-button"));

  let errorAlert = await waitFor(() => getByTestId("login-error-alert"));
  expect(errorAlert).toBeInTheDocument();

  fireEvent.click(getByTestId("CloseIcon"));
  expect(errorAlert).not.toBeInTheDocument();
});

// WIP: Pending to make it work the mocked implementation of history.push
test.skip("Redirect to /user/{user} when user authenticated.", async () => {
  const { getByTestId } = render(<Login />);

  axios.get.mockImplementationOnce(() => Promise.resolve({ status: 200 }));

  let username = document.querySelector("[id=username]");
  let password = document.querySelector("[id=password]");

  fireEvent.change(username, { target: { value: "username" } });
  fireEvent.change(password, { target: { value: "password" } });
  fireEvent.click(getByTestId("sign-in-button"));

  expect(mockHistoryPush).toHaveBeenCalledWith("/user/username");
});

test("Redirect to sign up page when clicked in the link.", () => {
  const { getByTestId } = render(<Login />);
  expect(getByTestId("login-redirect-sign-up").getAttribute("href")).toBe(
    "/sign-up"
  );
});

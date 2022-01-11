import { render, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import Signup from "./Signup";

jest.mock("axios");

const mockHistoryPush = jest.fn();
jest.mock("react-router-dom", () => ({
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

test("Display error when register button is clicked with empty username.", () => {
  const { getByTestId } = render(<Signup />);

  let usernameHelperText = document.querySelector("[id=username-helper-text]");
  expect(usernameHelperText).not.toBeInTheDocument();

  fireEvent.click(getByTestId("register-button"));

  usernameHelperText = document.querySelector("[id=username-helper-text]");
  expect(usernameHelperText).toBeInTheDocument();
  expect(usernameHelperText.textContent).toBe("Username cannot be empty");
});

test("Display error when register button is clicked with empty password.", () => {
  const { getByTestId } = render(<Signup />);

  let passwordHelperText = document.querySelector("[id=password-helper-text]");
  expect(passwordHelperText).not.toBeInTheDocument();

  fireEvent.click(getByTestId("register-button"));

  passwordHelperText = document.querySelector("[id=password-helper-text]");
  expect(passwordHelperText).toBeInTheDocument();
  expect(passwordHelperText.textContent).toBe(
    "Password must be at least 8 characters long"
  );
});

test("Display error when register button is clicked with a password of less than 8 characters.", () => {
  const { getByTestId } = render(<Signup />);

  let password = document.querySelector("[id=password]");
  expect(password.value).toBe("");

  let passwordHelperText = document.querySelector("[id=password-helper-text]");
  expect(passwordHelperText).not.toBeInTheDocument();

  fireEvent.change(password, { target: { value: "1234567" } });
  fireEvent.click(getByTestId("register-button"));

  passwordHelperText = document.querySelector("[id=password-helper-text]");
  expect(passwordHelperText).toBeInTheDocument();
  expect(passwordHelperText.textContent).toBe(
    "Password must be at least 8 characters long"
  );
});

test("Do not display text field error if username and password are not empty.", async () => {
  const { getByTestId } = render(<Signup />);

  axios.post.mockImplementationOnce(() => Promise.reject({ response: {} }));

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
  fireEvent.click(getByTestId("register-button"));

  usernameHelperText = document.querySelector("[id=username-helper-text]");
  passwordHelperText = document.querySelector("[id=password-helper-text]");
  expect(usernameHelperText).not.toBeInTheDocument();
  expect(passwordHelperText).not.toBeInTheDocument();
});

test("Display error alert when the user already exists.", async () => {
  const { getByTestId } = render(<Signup />);

  const response = { data: "USER_ALREADY_EXISTS", status: 201 };
  axios.post.mockImplementationOnce(() => Promise.resolve(response));

  let username = document.querySelector("[id=username]");
  let password = document.querySelector("[id=password]");

  fireEvent.change(username, { target: { value: "username" } });
  fireEvent.change(password, { target: { value: "password" } });
  fireEvent.click(getByTestId("register-button"));

  let errorAlert = await waitFor(() => getByTestId("sign-up-error-alert"));
  expect(errorAlert).toBeInTheDocument();
  expect(errorAlert.textContent).toBe(
    `Cannot register the user: ${response.data}`
  );
});

test("Display error alert when response there is an error with status.", async () => {
  const { getByTestId } = render(<Signup />);

  const status = 500;
  axios.post.mockImplementationOnce(() =>
    Promise.reject({ response: { status } })
  );

  let username = document.querySelector("[id=username]");
  let password = document.querySelector("[id=password]");

  fireEvent.change(username, { target: { value: "username" } });
  fireEvent.change(password, { target: { value: "password" } });
  fireEvent.click(getByTestId("register-button"));

  let errorAlert = await waitFor(() => getByTestId("sign-up-error-alert"));
  expect(errorAlert).toBeInTheDocument();
  expect(errorAlert.textContent).toBe(
    `Something unexpected happened. ERROR ${status}`
  );
});

test("Display error alert when there is no response status.", async () => {
  const { getByTestId } = render(<Signup />);

  axios.post.mockImplementationOnce(() =>
    Promise.reject("This error has no response status")
  );

  let username = document.querySelector("[id=username]");
  let password = document.querySelector("[id=password]");

  fireEvent.change(username, { target: { value: "username" } });
  fireEvent.change(password, { target: { value: "password" } });
  fireEvent.click(getByTestId("register-button"));

  let errorAlert = await waitFor(() => getByTestId("sign-up-error-alert"));
  expect(errorAlert).toBeInTheDocument();
  expect(errorAlert.textContent).toBe(
    "Something unexpected happened. Try again later."
  );
});

test("Close error alert when click on the close icon.", async () => {
  const { getByTestId } = render(<Signup />);

  axios.post.mockImplementationOnce(() => Promise.reject("Some error"));

  let username = document.querySelector("[id=username]");
  let password = document.querySelector("[id=password]");

  fireEvent.change(username, { target: { value: "username" } });
  fireEvent.change(password, { target: { value: "password" } });
  fireEvent.click(getByTestId("register-button"));

  let errorAlert = await waitFor(() => getByTestId("sign-up-error-alert"));
  expect(errorAlert).toBeInTheDocument();

  fireEvent.click(getByTestId("CloseIcon"));
  expect(errorAlert).not.toBeInTheDocument();
});

// WIP: Pending to make it work the mocked implementation of history.push
test.skip("Redirect to /user/{user} when user registered.", async () => {
  const { getByTestId } = render(<Signup />);

  axios.post.mockImplementationOnce(() =>
    Promise.resolve({ data: "USER_CREATED", status: 201 })
  );

  let username = document.querySelector("[id=username]");
  let password = document.querySelector("[id=password]");

  fireEvent.change(username, { target: { value: "username" } });
  fireEvent.change(password, { target: { value: "password" } });
  fireEvent.click(getByTestId("register-button"));

  expect(mockHistoryPush).toHaveBeenCalledWith("/user/username");
});

test("Redirect to sign up page when clicked in the link.", () => {
  const { getByTestId } = render(<Signup />);
  expect(getByTestId("sign-up-redirect-login").getAttribute("href")).toBe(
    "/login"
  );
});

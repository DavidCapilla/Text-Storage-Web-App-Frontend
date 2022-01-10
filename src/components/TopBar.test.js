import { render, fireEvent } from "@testing-library/react";
import TopBar from "./TopBar";

const mockHistoryPush = jest.fn();
jest.mock("react-router-dom", () => ({
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

test("Redirect to login page when login button is clicked", () => {
  const { getByTestId } = render(<TopBar />);
  fireEvent.click(getByTestId("top-bar-login-button"));
  expect(mockHistoryPush).toHaveBeenCalledWith("/login");
});

test("Redirect to home page when home icon button is clicked", () => {
  const { getByTestId } = render(<TopBar />);
  fireEvent.click(getByTestId("top-bar-home-icon-button"));
  expect(mockHistoryPush).toHaveBeenCalledWith("/");
});

test("Redirect to sign up page when sign up button is clicked", () => {
    const { getByTestId } = render(<TopBar />);
    fireEvent.click(getByTestId("top-bar-sign-up-button"));
    expect(mockHistoryPush).toHaveBeenCalledWith("/sign-up");
  });
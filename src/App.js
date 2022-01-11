import { BrowserRouter as Router, Route } from "react-router-dom";
import TopBar from "./components/TopBar";
import Login from "./components/account/Login";
import Signup from "./components/account/Signup";

const App = () => {
  return (
    <Router>
      <TopBar/>
      <Route
        path="/"
        exact
        render={(props) => (
          <>
            <div className="App"> 
              <h1> Welcome to Reflexiones de sofá </h1>
            </div>
          </>
        )}
      />
      <Route path="/login" component={Login} />
      <Route path="/sign-up" component={Signup} />
    </Router>
  );
};

export default App;

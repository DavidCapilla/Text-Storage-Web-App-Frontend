import { BrowserRouter as Router, Route } from 'react-router-dom'
import Login from './components/Login'

function App() {
  return (
    <Router>
      <Route path='/' exact render={(props) =>
        <>
          <div className="App">
            <h1> Welcome to Reflexiones de sofá </h1>
            <p>Log in <a href="/login"> here</a>.</p>
          </div>
        </>} />
      <Route path='/login' component={Login} />
    </Router>
  );
}

export default App;
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import '!style-loader!css-loader!react-toastify/dist/ReactToastify.css';
import Home from './components/home/Home';
import Login from './components/home/LoginForm';
import Register from './components/booking/Register';
import Flights from './components/flights/Flights';
import PageNotFound from './components/PageNotFound';

function App() {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register/:flightNumber" component={Register} />
			  <Route path="/flights" component={Flights} />
        <Route component={PageNotFound} />
      </Switch>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover/>
    </div>
  );
}

export default App;


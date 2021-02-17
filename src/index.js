import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider as ReduxProvider  } from 'react-redux';
import configureStore from './store';
import App from './App';
import './styles/main.scss';

const store = configureStore();

render(
    <ReduxProvider store={store}>
        <Router>
            <App />
        </Router>
    </ReduxProvider>,
    document.getElementById('app')
);
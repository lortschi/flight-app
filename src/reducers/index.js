import { combineReducers } from 'redux';
import flights from './flightReducer';
import passengers from './passengerReducer';
import login from './loginReducer';
import apiCallsInProgress from './apiStatusReducer';

export default combineReducers({
	flights,
	passengers,
	login,
	apiCallsInProgress,
});
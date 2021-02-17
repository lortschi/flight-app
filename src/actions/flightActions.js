import * as types from './actionTypes';
import * as flightsApi from '../api/flightsApi';
import { beginApiCall, apiCallError } from './apiStatusActions';

export function loadFlightSuccess(flights) {
	return { type: types.LOAD_FLIGHTS_SUCCESS, flights };
}

export function loadFlights() {
	return function (dispatch) {
		dispatch(beginApiCall());

		return flightsApi.getFlights().then((flights) => {
			dispatch(loadFlightSuccess(flights));
		}).catch((error) => {
			dispatch(apiCallError(error));
			throw error;
		});
	};
}

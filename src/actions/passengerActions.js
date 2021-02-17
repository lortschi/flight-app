import * as types from './actionTypes';
import * as passengersApi from '../api/passengersApi';
import { beginApiCall, apiCallError } from './apiStatusActions';

export function loadPassengerSuccess(passengers) {
  	return { type: types.LOAD_PASSENGERS_SUCCESS, passengers };
}

export function updatePassengerSuccess(passenger) {
  	return { type: types.UPDATE_PASSENGER_SUCCESS, passenger };
}

export function createPassengerSuccess(passenger) {
  	return { type: types.CREATE_PASSENGER_SUCCESS, passenger };
}

export function loadPassengers() {
	return function (dispatch) {
		dispatch(beginApiCall());
		return passengersApi.getPassengers().then((passengers) => {
			dispatch(loadPassengerSuccess(passengers));
		})
		.catch((error) => {
			dispatch(apiCallError(error));
			throw error;
		});
	};
}

export function savePassenger(passenger) {
	return function (dispatch) {
		dispatch(beginApiCall());
		return passengersApi.savePassenger(passenger).then((savedPassenger) => {
			if (passenger.id) {
			dispatch(updatePassengerSuccess(savedPassenger));
			} else {
			dispatch(createPassengerSuccess(savedPassenger));
			}
		})
		.catch((error) => {
			dispatch(apiCallError(error));
			throw error;
		});
	};
}

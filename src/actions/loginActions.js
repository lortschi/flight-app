import * as types from './actionTypes';
import * as loginApi from '../api/loginApi';
import { beginApiCall, apiCallError } from './apiStatusActions';

export function loadLoginSuccess(login) {
	return { type: types.LOAD_LOGIN_SUCCESS, login };
}

export function updateLoginSuccess(login) {
	return { type: types.UPDATE_LOGIN_SUCCESS, login };
}

export function loadLogin() {
	return function (dispatch) {
		dispatch(beginApiCall());
		return loginApi.getLogin().then((login) => {
			dispatch(loadLoginSuccess(login));
		})
		.catch((error) => {
			dispatch(apiCallError(error));
			throw error;
		});
	};
}

export function setLogin(login) {
	return function (dispatch) {
		dispatch(beginApiCall());
		return loginApi
		.setLogin(login)
		.then((setLogin) => { 
				dispatch(updateLoginSuccess(setLogin));
		})
		.catch((error) => {
			dispatch(apiCallError(error));
			throw error;
		});
	};
}



/* eslint-disable import/prefer-default-export */
import { handleResponse, handleError } from './apiUtils';

const baseUrl = 'http://localhost:3001/login/';

export function getLogin() {
	return fetch(baseUrl).then(handleResponse).catch(handleError);
}

export function setLogin(login) {
	return fetch(`${baseUrl}1`, {
		method: 'PATCH',
		headers: {
			'content-type': 'application/json',
		},
		body: JSON.stringify({
			loggedIn: login[0].loggedIn
		})
	}).then(handleResponse).catch(handleError);
}

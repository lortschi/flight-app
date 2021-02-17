import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import configureMockStore from 'redux-mock-store';
import * as passengerActions from './passengerActions';
import { passengers } from '../api/mockData';
import * as types from './actionTypes';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

describe('Async Actions', () => {
	afterEach(() => {
		fetchMock.restore();
	});

  describe('Load Passengers Thunk', () => {
	it('should create BEGIN_API_CALL and LOAD_PASSENGERS_SUCCESS when loading flights', () => {
		fetchMock.mock('*', {
			body: passengers,
			headers: { 'content-type': 'application/json' },
		});

		const expectedActions = [
			{ type: types.BEGIN_API_CALL },
			{ type: types.LOAD_PASSENGERS_SUCCESS, passengers },
		];

		const store = mockStore({ flights: [] });
		return store.dispatch(passengerActions.loadPassengers()).then(() => {
			expect(store.getActions()).toEqual(expectedActions);
		});
	});
  });
});

describe('savePassenger success', () => {
  it('should create a CREATE_PASSENGER_SUCCESS action', () => {
	const passenger = passengers[0];
	const expectedAction = {
		type: types.CREATE_PASSENGER_SUCCESS,
		passenger,
	};
	const action = passengerActions.createPassengerSuccess(passenger);
	expect(action).toEqual(expectedAction);
  });
});

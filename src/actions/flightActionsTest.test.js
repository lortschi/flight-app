import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import configureMockStore from 'redux-mock-store';
import * as flightActions from './flightActions';
import { flights } from '../api/mockData';
import * as types from './actionTypes';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

describe('Async Actions', () => {
	afterEach(() => {
		fetchMock.restore();
	});

	describe('Load Flights Thunk', () => {
		it('should create BEGIN_API_CALL and LOAD_FLIGHTS_SUCCESS when loading flights', () => {
			fetchMock.mock('*', {
				body: flights,
				headers: { 'content-type': 'application/json' },
			});

			const expectedActions = [
				{ type: types.BEGIN_API_CALL },
				{ type: types.LOAD_FLIGHTS_SUCCESS, flights },
			];

			const store = mockStore({ flights: [] });
			return store.dispatch(flightActions.loadFlights()).then(() => {
				expect(store.getActions()).toEqual(expectedActions);
			});
		});
	});
});

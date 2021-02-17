const flights = [
	{
		id: 1,
		flightNumber: 'ATG2252',
		airCraftType: 'Airbus A320-214',
		from: 'BUD',
		to: 'FRA',
		seat: [
			'A1', 'B1', 'C1', 'D1', 'E1', 'F1',
			'A2', 'B2', 'C2', 'D2', 'E2', 'F2',
			'A3', 'B3', 'C3', 'D3', 'E3', 'F3',
			'A4', 'B4', 'C4', 'D4', 'E4', 'F4',
			'A5', 'B5', 'C5', 'D5', 'E5', 'F5',
			'A6', 'B6', 'C6', 'D6', 'E6', 'F6',
		]
	},
	{
		id: 2,
		flightNumber: 'KL1364',
		airCraftType: 'Embraer E190STD',
		from: 'BUD',
		to: 'AMS',
		seat: [
			'A1', 'B1', 'C1', 'D1', 'E1', 'F1',
			'A2', 'B2', 'C2', 'D2', 'E2', 'F2',
			'A3', 'B3', 'C3', 'D3', 'E3', 'F3',
			'A4', 'B4', 'C4', 'D4', 'E4', 'F4',
			'A5', 'B5', 'C5', 'D5', 'E5', 'F5',
			'A6', 'B6', 'C6', 'D6', 'E6', 'F6',
		],
	},
	{
		id: 3,
		flightNumber: 'LH8413',
		airCraftType: 'Boeing 777-F',
		from: 'BUD',
		to: 'LHR',
		seat: [
			'A1', 'B1', 'C1', 'D1', 'E1', 'F1',
			'A2', 'B2', 'C2', 'D2', 'E2', 'F2',
			'A3', 'B3', 'C3', 'D3', 'E3', 'F3',
			'A4', 'B4', 'C4', 'D4', 'E4', 'F4',
			'A5', 'B5', 'C5', 'D5', 'E5', 'F5',
			'A6', 'B6', 'C6', 'D6', 'E6', 'F6',
		],
	},
	{
		id: 4,
		flightNumber: 'SU3312',
		airCraftType: 'VQ-BED',
		from: 'BUD',
		to: 'SVO',
		seat: [
			'A1', 'B1', 'C1', 'D1', 'E1', 'F1',
			'A2', 'B2', 'C2', 'D2', 'E2', 'F2',
			'A3', 'B3', 'C3', 'D3', 'E3', 'F3',
			'A4', 'B4', 'C4', 'D4', 'E4', 'F4',
			'A5', 'B5', 'C5', 'D5', 'E5', 'F5',
			'A6', 'B6', 'C6', 'D6', 'E6', 'F6',
		],
	},
	{
		id: 5,
		flightNumber: 'SK1673',
		airCraftType: 'Mitsubishi CRJ-9000LR',
		from: 'BUD',
		to: 'CPH',
		seat: [
			'A1', 'B1', 'C1', 'D1', 'E1', 'F1',
			'A2', 'B2', 'C2', 'D2', 'E2', 'F2',
			'A3', 'B3', 'C3', 'D3', 'E3', 'F3',
			'A4', 'B4', 'C4', 'D4', 'E4', 'F4',
			'A5', 'B5', 'C5', 'D5', 'E5', 'F5',
			'A6', 'B6', 'C6', 'D6', 'E6', 'F6',
		],
	},
];

const login = [
	{
		id: 1,
		name: 'airline@app.com',
		password: 'test123',
		loggedIn: false
	},
];

const passengers = [
	{
		id: 1,
		name: 'John',
		surname: 'Burg',
		checkIn: true,
		flightNumber: 'ATG2252',
		seat: 'C1',
		passportNumber: '382dsj02',
		dateOfBirth: '07/21/1982',
		wheelChairRequired: false,
		infants: false,
		address: {
			street: 'Oxford Street 22/3',
			city: 'London',
			country: 'Great Britain',
		},
		ancillaryServices: {
			priorityBoarding: true,
			specialMeals: 'vege',
			shoppingItems: true,
		},
	},
	{
		id: 2,
		name: 'Mark',
		surname: 'Wieneken',
		checkIn: true,
		flightNumber: 'KL1364',
		seat: 'A3',
		passportNumber: '291d02',
		dateOfBirth: '11/06/1991',
		wheelChairRequired: true,
		infants: false,
		address: {
			street: 'Mainzer Landstrasse 15',
			city: 'Wiesbaden',
			country: 'Germany',
		},
		ancillaryServices: {
			priorityBoarding: true,
			specialMeals: 'regular',
			shoppingItems: true,
		},
	},
	{
		id: 3,
		name: 'John',
		surname: 'Malkovic',
		checkIn: true,
		flightNumber: 'ATG2252',
		seat: 'B2',
		passportNumber: 'a5503f',
		dateOfBirth: '04/09/1988',
		wheelChairRequired: false,
		infants: true,
		address: {
			street: 'Beverly Street 4',
			city: 'Oakland',
			country: 'USA',
		},
		ancillaryServices: {
			priorityBoarding: false,
			specialMeals: 'regular',
			shoppingItems: false,
		},
	},
	{
		id: 4,
		name: 'Tibor',
		surname: 'Meszaros',
		checkIn: false,
		flightNumber: 'ATG2252',
		seat: 'C5',
		passportNumber: '',
		dateOfBirth: '05/20/1979',
		wheelChairRequired: false,
		infants: true,
		address: {
			street: 'Dunaföldvari Ut 3',
			city: 'Budapest',
			country: 'Hungary',
		},
		ancillaryServices: {
			priorityBoarding: true,
			specialMeals: 'vege',
			shoppingItems: true,
		},
	},
];

// Using CommonJS style export so we can consume via Node (without using Babel-node)
module.exports = {
	flights,
	login,
	passengers,
};

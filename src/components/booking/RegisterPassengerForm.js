import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import DateFnsUtils from '@date-io/date-fns';
import { List, Button, FormControl, FormControlLabel, Checkbox, TextField, FormHelperText, Divider } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import style from '../../styles/main.scss';


/**
 * RegisterPassengerForm function component is the passenger form for Check-In
 * and also for admin add / edit passenger. 
 * 
 * @typedef {object} Props
 * @prop {array} passenger
 * @prop {function} onSave
 * @prop {array} login
 * @prop {function} setPassengerId
 * @prop {function} adminEditPassenger
 * 
 * @param {array} passenger array object of all passengers
 * @param {function} onSave callback submit handler
 * @param {array} login array object of user logins
 * @param {function} setPassengerId callback
 * @param {function} adminEditPassenger callback
 * 
 * @extends {Component<Props>}
 * @return {React.ReactElement}
 */

const RegisterPassengerForm = ({ passenger, onSave, setPassengerId, login, adminEditPassenger }) => {

	const [selectedDate, setSelectedDate] = useState(new Date());
	const [stateChackboxes, setState] = useState({
		wheelChairRequired: false,
		infants: false,
		priorityBoarding: false,
		shoppingItems: false
	});

	const [statePassenger, setLastPassenger] = useState({});
	const [stateCheckIn, setCheckIn] = useState(false);
	const [loggedIn, setLogin] = useState();

	/**
	 * Handles checkbox changes
	 * 
	 * @param {HTMLEvent} event 
	 */
	const handleChange = event => {
		setState({ ...stateChackboxes, [event.target.name]: event.target.checked });
	};

	/**
	 * Handles date changes
	 * 
	 * @param {object} date 
	 */
	const handleDateChange = date => {
		setSelectedDate(date);
	};

	/**
	 * Handles reset form changes
	 */
	const handleResetForm = () => {
		setLastPassenger({});
		setState({
			wheelChairRequired: false,
			infants: false,
			priorityBoarding: false,
			shoppingItems: false
		});
		setSelectedDate(new Date());
	}

	/**
	 * MapPassenger maps all form data of current passenger to the form.
	 * 
	 * @param {array} tableValue of the PassengerList table.
	 * 
	 * @return {array} pass as passenger
	 * @return {undefined}
	 */
	const mapPassenger = (tableValue) => {   
		const passengerPick = passenger.map((pass, i) => {
			if ((passenger.length - 1) === i && localStorage.getItem('checkedIn') && !loggedIn) {
				return pass;
			} else if (tableValue !== null && tableValue !== undefined && loggedIn) {
				if (tableValue.indexOf(pass.name) !== -1 && tableValue.indexOf(pass.surname) !== -1) {
					return pass;	
				}
			}
		}).filter(x => x);

		const destArrayPassengers = Object.assign({}, ...passengerPick);

		if (Object.keys(destArrayPassengers).length < 1) {
			return;
		}

		setLastPassenger(destArrayPassengers);
		setState({ ...stateChackboxes, wheelChairRequired: destArrayPassengers.wheelChairRequired, infants: destArrayPassengers.infants, priorityBoarding: destArrayPassengers.ancillaryServices.priorityBoarding, shoppingItems: destArrayPassengers.ancillaryServices.shoppingItems });
		setSelectedDate(new Date(destArrayPassengers.dateOfBirth));
		setCheckIn(true);
	}

	useEffect(() => {
		if (login.length < 1) {
			return;
		}
		setLogin(login[0].loggedIn);
	}, [login]);

	useEffect(() => {
		setPassengerId(statePassenger.id);
	}, [statePassenger])

	useEffect(() => {
		if (loggedIn !== undefined) {
			mapPassenger();
		}
	}, [loggedIn]);

	useEffect(() => {
		if (loggedIn !== undefined) {
			mapPassenger(adminEditPassenger);
		}
	}, [loggedIn, adminEditPassenger])

	return (
		<div className="flexContainer">
			<form onSubmit={onSave}>
				<FormControl className={style.passengerFormControlWrapper}>
					<FormHelperText style={{fontSize: '1.3rem'}}>Personal Information</FormHelperText>
					<List style={{display: 'flex', flexDirection: 'row'}}>
						<TextField
							id="name"
							name="name"
							label="Name"
							required={true}
							disabled={!loggedIn && stateCheckIn ? true : false}
							value={statePassenger.name || ''}
							onChange={(e) => setLastPassenger({ ...statePassenger, [e.target.name]: e.target.value } )}
						>
						</TextField>
						<TextField
							id="surname"
							name="surname"
							label="Surname"
							required={true}
							disabled={!loggedIn && stateCheckIn ? true : false}
							value={statePassenger.surname || ''}
							onChange={(e) => setLastPassenger({ ...statePassenger, [e.target.name]: e.target.value } )}
						>
						</TextField>
					</List>
					<List style={{display: 'flex', flexDirection: 'column'}}>
						<TextField
							id="passportNumber"
							name="passportNumber"
							label="Passport Number"
							value={statePassenger.passportNumber || ''}
							onChange={(e) => setLastPassenger({ ...statePassenger, [e.target.name]: e.target.value } )}
						>
						</TextField>
					</List>
					<List style={{display: 'flex', flexDirection: 'column'}}>
						<MuiPickersUtilsProvider utils={DateFnsUtils}>
							<KeyboardDatePicker
								disableToolbar
								variant="inline"
								format="MM/dd/yyyy"
								margin="normal"
								id="dateOfBirth"
								name="dateOfBirth"
								label="Date of Birth"
								value={selectedDate || new Date()}
								onChange={handleDateChange}
								KeyboardButtonProps={{
									'aria-label': 'change date',
								}}
							/>
						</MuiPickersUtilsProvider>
					</List>
					<List style={{display: 'flex', flexDirection: 'row'}}>
						<FormControlLabel control={
								<Checkbox
									id="wheelChairRequired"
									checked={stateChackboxes.wheelChairRequired || false}
									value={stateChackboxes.wheelChairRequired || false}
									name="wheelChairRequired"
									color="primary"
									onChange={handleChange}
								/>
							}
							label="Wheelchair"
						/>
						<FormControlLabel control={
								<Checkbox
									id="infants"
									checked={stateChackboxes.infants || false}
									value={stateChackboxes.infants || false}
									name="infants"
									color="primary"
									onChange={handleChange}
								/>
							}
							label="Child > 2 yrs."
						/>
					</List>

					<List style={{display: 'flex', flexDirection: 'column'}}>
						<Divider variant="inset" component="li" />
						<FormHelperText>Address</FormHelperText>
						<TextField
							id="street"
							name="street"
							label="Street"
							value={Object.keys(statePassenger).length > 0 && statePassenger.address !== undefined ? statePassenger.address.street : ''}
							onChange={(e) => setLastPassenger({ ...statePassenger, address: { ...statePassenger.address, [e.target.name]: e.target.value } } )}
						>
						</TextField>
						<TextField
							id="city"
							name="city"
							label="City"
							value={Object.keys(statePassenger).length > 0 && statePassenger.address !== undefined ? statePassenger.address.city : ''}
							onChange={(e) => setLastPassenger({ ...statePassenger, address: { ...statePassenger.address, [e.target.name]: e.target.value } } )}
						>
						</TextField>
						<TextField
							id="country"
							name="country"
							label="Country"
							value={Object.keys(statePassenger).length > 0 && statePassenger.address !== undefined ? statePassenger.address.country : ''}
							onChange={(e) => setLastPassenger({ ...statePassenger, address: { ...statePassenger.address, [e.target.name]: e.target.value } })}
						>
						</TextField>
					</List>

					<List style={{display: 'flex', flexDirection: 'column'}}>
						<Divider variant="inset" component="li" />
						<FormHelperText>Services</FormHelperText>
						<FormControlLabel control={
							<Checkbox
								id="priorityBoarding"
								checked={stateChackboxes.priorityBoarding || false}
								value={stateChackboxes.priorityBoarding || false}
								name="priorityBoarding"
								color="primary"
								onChange={handleChange}
							/>
							}
							label="Priority Boarding"
						/>
						<TextField
							id="specialMeals"
							name="specialMeals"
							label="Special Meals"
							value={Object.keys(statePassenger).length > 0 && statePassenger.ancillaryServices !== undefined ? statePassenger.ancillaryServices.specialMeals : ''}
							onChange={(e) => setLastPassenger({ ...statePassenger, ancillaryServices: { ...statePassenger.ancillaryServices, [e.target.name]: e.target.value } })}
						>
						</TextField>
					</List>
					<List style={{display: 'flex', flexDirection: 'column'}}>
						<Divider variant="inset" component="li" />
						<FormHelperText>Shopping</FormHelperText>
						<FormControlLabel control={
								<Checkbox
									id="shoppingItems"
									checked={stateChackboxes.shoppingItems || false}
									value={stateChackboxes.shoppingItems || false}
									name="shoppingItems"
									color="primary"
									onChange={handleChange}
								/>
							}
							label="Shopping Items"
						/>
					</List>
					{!loggedIn ? <><Button
						type="submit"
						variant="outlined"
						color="primary"
					>
						{stateCheckIn ? 'Edit Check-In' : 'Check-In'}
					</Button> <br /> </> : <><Button
							variant="outlined"
							color="secondary"
							onClick={handleResetForm}
						>
							Reset Form
					</Button>
					<><br /></>
					<Button
							type="submit"
							variant="outlined"
							color="primary"
						>
								Add / Edit Passenger
					</Button>
					<br /></>}
				</FormControl>
			</form>
		</div>
	)
}

RegisterPassengerForm.propTypes = {
	onSave: PropTypes.func.isRequired,
	setPassengerId: PropTypes.func.isRequired,
	login: PropTypes.array.isRequired,
	adminEditPassenger: PropTypes.array
};

export default RegisterPassengerForm;

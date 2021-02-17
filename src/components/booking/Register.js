import React, { Component, Suspense } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ProgressBar from '../ProgressBar';
import { Grid } from '@material-ui/core';
import * as flightActions from '../../actions/flightActions';
import * as passengerActions from '../../actions/passengerActions';
import * as loginActions from '../../actions/loginActions';
import RegisterPassengerForm from './RegisterPassengerForm';
import PassengerList from './PassengerList';
import MenuBar from '../MenuBar';
import SeatPlan from './SeatPlan';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import style from '../../styles/main.scss';

/**
 * The Register class is the main operation wrapper component.
 * 
 * @typedef {object} Props
 * @prop {array} passenger
 * @prop {array} login
 * @prop {array} flights
 * @prop {boolean} loading
 * @prop {object} actions
 *
 * @extends {Component<Props>}
 * @return {React.ReactElement}
 */
class Register extends Component {

	state = {
		...this.props,
		seatChoosen: '',
		passengerId: null,
		adminEditPassengerId: null
	}

	componentDidMount = () => {
		this.props.actions.loadPassengers().catch((error) => {
			alert(`Loading passengers failed ${error}`);
		});

		this.props.actions.loadFlights().catch((error) => {
			alert(`Loading flights failed ${error}`);
		});

		this.props.actions.loadLogin().catch((error) => {
			alert(`Loading login failed ${error}`);
		});
	}

	/**
	 * OnCheckedSeat handles the seat change by passenger and admin. 
	 * @param {string} val 
	 */
	onCheckedSeat = (val) => {
		this.setState({ seatChoosen: val });
	}

	/**
	 * SetPassengerId handles the Checked-In passenger's id.
	 * @param {number} id
	 */
	setPassengerId = (id) => {
		this.setState({ passengerId: id });
	}

	/**
	 * OnSave is the submit handler for the RegisterPassengerForm component.
	 * @param {HTMLElement} event
	 * 
	 * @return {undefined}
	 */
	onSave = (event) => {
		event.preventDefault();

		let checkedInPassengerData = null;
		if (localStorage.getItem('checkedIn')) {
			checkedInPassengerData = JSON.parse(localStorage.getItem('checkedIn'));
		}

		if (this.state.seatChoosen === '' && checkedInPassengerData === null) {
			toast.warning(`Please choose first your seat on flight ${this.state.match.params.flightNumber}`);
			return;
		}

		const passenger = {
			id: this.state.passengerId ? this.state.passengerId : null,
			name: event.target[0].value,
			surname: event.target[1].value,
			checkIn: true,
			flightNumber: this.state.match.params.flightNumber,
			seat: this.state.seatChoosen !== '' ? this.state.seatChoosen : checkedInPassengerData.seat,
			passportNumber: event.target[2].value,
			dateOfBirth: event.target[3].value,
			wheelChairRequired: JSON.parse(event.target[5].value),
			infants: JSON.parse(event.target[6].value),
			address: {
				street: event.target[7].value,
				city: event.target[8].value,
				country: event.target[9].value,
			},
			ancillaryServices: {
				priorityBoarding: JSON.parse(event.target[10].value),
				specialMeals: event.target[11].value === '' ? 'regular' : event.target[11].value,
				shoppingItems: JSON.parse(event.target[12].value),
			}
		}

		if (this.props.login[0].loggedIn && this.state.seatChoosen === '') {
			Swal.fire({
				title: 'Seat Reservation',
				text: "You are about to Check-In passenger onto an occupied seat!",
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes, Check-In passenger to this seat!'
			}).then((result) => {
				if (result.isConfirmed) {
					this.props.actions.savePassenger(passenger).then(() => {
						this.props.actions.loadPassengers();
						toast.success(`Admin has been checked passenger ${passenger.name} ${passenger.surname} in to flight ${this.state.match.params.flightNumber}`);
					}).catch((error) => {
						toast.error(`Oho something went wrong -> ${error}`);
					});
				}
			});
		} else {
			this.props.actions.savePassenger(passenger).then(() => {
				!this.props.login[0].loggedIn ? localStorage.setItem('checkedIn', JSON.stringify({ surname: passenger.surname, passportNumber: passenger.passportNumber, seat: passenger.seat, flightNumber: passenger.flightNumber })) : '';
				this.props.actions.loadPassengers();
				!this.props.login[0].loggedIn ? toast.success(`Congratualation you have been checked in to flight ${this.state.match.params.flightNumber}`) : toast.success(`Admin has been checked passenger ${passenger.name} ${passenger.surname} in to flight ${this.state.match.params.flightNumber}`);
			}).catch((error) => {
				toast.error(`Oho something went wrong -> ${error}`);
			});
		}
	};

	/**
	 * AdminEditPassenger handles the choosen passenger from the PassengersList component.
	 * @param {array} value of an array of choosen passenger's.
	 */
	adminEditPassenger = (value) => {
		this.setState({ adminEditPassengerId: value });
	}

	/**
	 * Menubar handles in the left upper corner of the screen
	 * log-in / -out changes and linking the home screen.
	 */
	handleMenuChange = () => {
		const { login, actions, history } = this.props;
		if (login[0].loggedIn) {
			actions.setLogin([{
				id: 1,
				name: login[0].name,
				password: login[0].password,
				loggedIn: false
			}]).then(() => {
				actions.loadLogin();
			});
		} else {
			history.push('/login');
		}
	}

	render() {
		const { flights, passenger, login, history } = this.props;

		return (
			<>
				{this.props.loading ? (
					<ProgressBar />
				) : (
						<Suspense fallback={<ProgressBar />}>
							<MenuBar
								login={login}
								handleMenuChange={this.handleMenuChange}
								history={history}
							/>
							<Grid container className={style.registerPassengerFormContainer} alignItems="center" direction="row">
								<Grid container alignItems="center" direction="column">
									<PassengerList
										flights={flights}
										passenger={passenger}
										flightNumber={this.state.match.params.flightNumber}
										login={login}
										adminEditPassenger={this.adminEditPassenger}
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Grid container alignItems="center" direction="column">
										<SeatPlan
											onCheckedSeat={this.onCheckedSeat}
											flights={flights}
											passenger={passenger}
											flightNumber={this.state.match.params.flightNumber}
											login={login}
											adminEditPassenger={this.state.adminEditPassengerId}
										/>
									</Grid>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Grid className={style.registerPassengerFormWrapper} container alignItems="center" direction="column">
										<RegisterPassengerForm
											passenger={passenger}
											onSave={this.onSave}
											setPassengerId={this.setPassengerId}
											login={login}
											adminEditPassenger={this.state.adminEditPassengerId}
										/>
									</Grid>
								</Grid>
							</Grid>
						</Suspense>
				)}
			</>
		);
	}
};

Register.propTypes = {
	passenger: PropTypes.array.isRequired,
	flights: PropTypes.array.isRequired,
	actions: PropTypes.object.isRequired,
	loading: PropTypes.bool.isRequired,
	login: PropTypes.array.isRequired
};

const mapStateToProps = state => {
	return {
		loading: state.apiCallsInProgress > 0,
		passenger: state.passengers.map(passenger => ({
			...passenger,
		})),
		flights: state.flights,
		login: state.login
	};
};

const mapDispatchToProps = (dispatch) => ({
	actions: {
		loadFlights: bindActionCreators(flightActions.loadFlights, dispatch),
		loadPassengers: bindActionCreators(passengerActions.loadPassengers, dispatch),
		savePassenger: bindActionCreators(passengerActions.savePassenger, dispatch),
		loadLogin: bindActionCreators(loginActions.loadLogin, dispatch),
		setLogin: bindActionCreators(loginActions.setLogin, dispatch)
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);

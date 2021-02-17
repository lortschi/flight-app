import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import style from '../../styles/main.scss';

/**
 * SeatPlan function component handles the mapping of all Checked-In passengers
 * to the seats of the current flight.
 *  
 * @prop {array} flights
 * @prop {array} passenger
 * @prop {string} flightNumber
 * @prop {function} onCheckedSeat
 * @prop {array} login
 * @prop {function} adminEditPassenger
 * 
 * @param {array} flights array object of all flights
 * @param {array} passenger array object of all passengers
 * @param {string} flightNumber of the current flight
 * @param {function} onCheckedSeat callback
 * @param {array} login array object of user logins
 * @param {function} adminEditPassenger callback
 * 
 * @extends {Component<Props>}
 * @return {React.ReactElement}
 */
const SeatPlan = ({ flights, passenger, flightNumber, onCheckedSeat, login, adminEditPassenger }) => {

	const seatRef = useRef({});
	const [seatState, setSeats] = useState([]);
	const [checkedInSeatState, setCheckedInSeat] = useState('');

	/**
	 * MapSeatPlan handles the mapping of the seats with the Checked-In passenger.
	 * It distinguish between normal occupied, wheel chair, infant or infant with wheel chair.
	 *  
	 * @param {array} tableValue of the PassengerList component
	 * 
	 * @return {array} flight the current flight
	 * @return {array} seat the current passenger's seat
	 * @return {undefined}
	 * 
	 */
	const mapSeatPlan = (tableValue) => {
		if (login.length < 1) {
			return;
		}
		if ((tableValue !== null && tableValue !== undefined) && login[0].loggedIn) {
			try {
				passenger.map((pass, i) => {
					const splitSeat = pass.seat.split('_')[0];
					if (tableValue[3] === splitSeat) {
						setCheckedInSeat(splitSeat);
					}
				});				
			} catch (e) {}
		}
		if (localStorage.getItem('checkedIn') && (tableValue === null || tableValue === undefined) && !login[0].loggedIn) {
			const checkedInPassengerData = JSON.parse(localStorage.getItem('checkedIn')).seat;
			setCheckedInSeat(checkedInPassengerData);
		}
		let currentFlight = flights.filter(flight => {
			return flight.flightNumber === flightNumber;
		}).map(x => x.seat);

		currentFlight = [].concat.apply([], currentFlight);
		let currentFlightCheckedInByPassangers = passenger.filter(pass => {
			if (pass.flightNumber === flightNumber && pass.infants && !pass.wheelChairRequired) {
				pass.seat = pass.seat.split('_')[0];
				pass.seat = pass.seat + '_i';
			}
			if (pass.flightNumber === flightNumber && !pass.infants && pass.wheelChairRequired) {
				pass.seat = pass.seat.split('_')[0];
				pass.seat = pass.seat + '_w';
			}
			if (pass.flightNumber === flightNumber && pass.infants && pass.wheelChairRequired) {
				pass.seat = pass.seat.split('_')[0];
				pass.seat = pass.seat + '_r';
			}
			if (pass.flightNumber === flightNumber && !pass.infants && !pass.wheelChairRequired) {
				pass.seat = pass.seat.split('_')[0];
				pass.seat = pass.seat + '_o';
			}
			return pass.seat
		}).map(x => x.seat).filter(x => x);

		currentFlightCheckedInByPassangers = [].concat.apply([], currentFlightCheckedInByPassangers);

		currentFlightCheckedInByPassangers.forEach(currPassengerSeat => {
			currentFlight[currentFlight.findIndex(value => currPassengerSeat.split('_')[0] === value)] = currPassengerSeat;
		});
		
		let structSeatPlan = currentFlight.reduce((seat, arr) => {
			seat[arr[1]] = seat[arr[1]] ? [arr, ...seat[arr[1]]] : [arr];
			return seat;
		}, []).filter(x => x.reverse());

		setSeats(structSeatPlan);
	}

	/**
	 * ReserveSeat handles the seat choice on the current airplane of the passenger / admin.
	 * If the seat is clicked on, it's onchecks the checkbox embeded into the seat input element.
	 * 
	 * @param {HTMLElement} event
	 */
	const reserveSeat = (event) => {
		onCheckedSeat(event.currentTarget.id);
		for (let ref in seatRef) {
			Object.keys(seatRef[ref]).forEach(item => {
				if (event.currentTarget.id !== item) {
					seatRef[ref][item].checked = false;
				}
			});
		}
	}

	useEffect(() => {
		mapSeatPlan();
	}, [flights]);

	useEffect(() => {
		mapSeatPlan(adminEditPassenger);
	}, [adminEditPassenger]);

	return (
		<div key={style.planeWrapper} className={style.planeWrapper}>
			<div key={style.planeCockpit} className={style.planeCockpit}>
				<h1 key={style.planeCockpit + 'H1'}>{`Please select a seat on flight ${flightNumber}`}</h1>
			</div>
			<div key={style.exitPlane} className={`${style.exitPlane} ${style.exitFront} ${style.planeFuselage}`}></div>
			<ol key={style.planeCabin} className={`${style.planeCabin} ${style.planeFuselage}`}>
				<li key={style.planeRow + 'A'} className={`${style.planeRow}`}>
					<ol key={'A'} className={style.seatItems} type="A">
						{seatState.map((s, i) => i === 0 ? s.map((seat, l) =>
							<><li className={style.seatItem} key={s + i + l + 0}>
								<input type="checkbox" disabled={seat.split('_')[1] === undefined ? false : true} onClick={reserveSeat} className={(() => { if (seat.split('_')[1] === 'o') { return style.seatOccupied } else if (seat.split('_')[1] === 'i') { return style.seatInfant } else if (seat.split('_')[1] === 'w') { return style.seatWheelChair } else if (seat.split('_')[1] === 'r') { return style.seatInfChair } })()} ref={ref => (seatRef.current[seat] = ref)} key={s + l} id={seat} />
								<label style={checkedInSeatState === seat.split('_')[0] ? { background: '#4051B5' } : {}} key={seat + 501} htmlFor={seat}>{seat}</label>{seat.split('_')[1] !== undefined ? <div key={seat + 101 + l} className={style.toolTip}>
									<div key={seat + 0 + i} className={style.toolTipRight}>
										<div key={seat + i + l + 1} className={style.textContent}>
											<h3 key={l + seat + 0}>{(() => { if (seat.split('_')[1] === 'o') { return checkedInSeatState === seat.split('_')[0] ? 'Your occupied Chair' : 'Occupied' } else if (seat.split('_')[1] === 'i') { return checkedInSeatState === seat.split('_')[0] ? 'Your Infant Chair' : 'Infant' } else if (seat.split('_')[1] === 'w') { return checkedInSeatState === seat.split('_')[0] ? 'Your Wheel Chair' : 'Wheel Chair' } else if (seat.split('_')[1] === 'r') { return checkedInSeatState === seat.split('_')[0] ? 'Your Infant with Wheel Chair' : 'Infant with Wheel Chair' } })()}</h3>
										</div>
									</div>
								</div> : ''}
							</li>
						</>) : '')}
					</ol>
				</li>
				<li key={style.planeRow + 'B'} className={`${style.planeRow}`}>
					<ol key={'B'} className={style.seatItems} type="B">
						{seatState.map((s, i) => i === 1 ? s.map((seat, l) =>
							<><li className={style.seatItem} key={s + i + l + 0}>
								<input type="checkbox" disabled={seat.split('_')[1] === undefined ? false : true} onClick={reserveSeat} className={(() => { if (seat.split('_')[1] === 'o') { return style.seatOccupied } else if (seat.split('_')[1] === 'i') { return style.seatInfant } else if (seat.split('_')[1] === 'w') { return style.seatWheelChair } else if (seat.split('_')[1] === 'r') { return style.seatInfChair } })()} ref={ref => (seatRef.current[seat] = ref)} key={s + l} id={seat} />
								<label style={checkedInSeatState === seat.split('_')[0] ? { background: '#4051B5' } : {}} key={seat + 502} htmlFor={seat}>{seat}</label>{seat.split('_')[1] !== undefined ? <div key={seat + 202 + l} className={style.toolTip}>
									<div key={seat + 1 + i} className={style.toolTipRight}>
										<div key={seat + i + l + 2} className={style.textContent}>
											<h3 key={l + seat + 0}>{(() => { if (seat.split('_')[1] === 'o') { return checkedInSeatState === seat.split('_')[0] ? 'Your occupied Chair' : 'Occupied' } else if (seat.split('_')[1] === 'i') { return checkedInSeatState === seat.split('_')[0] ? 'Your Infant Chair' : 'Infant' } else if (seat.split('_')[1] === 'w') { return checkedInSeatState === seat.split('_')[0] ? 'Your Wheel Chair' : 'Wheel Chair' } else if (seat.split('_')[1] === 'r') { return checkedInSeatState === seat.split('_')[0] ? 'Your Infant with Wheel Chair' : 'Infant with Wheel Chair' } })()}</h3>
										</div>
									</div>
								</div> : ''}
							</li>
						</>) : '')}
					</ol>
				</li>
				<li key={style.planeRow + 'C'} className={`${style.planeRow}`}>
					<ol key={'C'} className={style.seatItems} type="C">
						{seatState.map((s, i) => i === 2 ? s.map((seat, l) =>
							<><li className={style.seatItem} key={s + i + l + 0}>
								<input type="checkbox" disabled={seat.split('_')[1] === undefined ? false : true} onClick={reserveSeat} className={(() => { if (seat.split('_')[1] === 'o') { return style.seatOccupied } else if (seat.split('_')[1] === 'i') { return style.seatInfant } else if (seat.split('_')[1] === 'w') { return style.seatWheelChair } else if (seat.split('_')[1] === 'r') { return style.seatInfChair } })()} ref={ref => (seatRef.current[seat] = ref)} key={s + l} id={seat} />
								<label style={checkedInSeatState === seat.split('_')[0] ? { background: '#4051B5' } : {}} key={seat + 503} htmlFor={seat}>{seat}</label>{seat.split('_')[1] !== undefined ? <div key={seat + 303 + l} className={style.toolTip}>
									<div key={seat + 2 + i} className={style.toolTipRight}>
										<div key={seat + i + l + 3} className={style.textContent}>
											<h3 key={l + seat + 0}>{(() => { if (seat.split('_')[1] === 'o') { return checkedInSeatState === seat.split('_')[0] ? 'Your occupied Chair' : 'Occupied' } else if (seat.split('_')[1] === 'i') { return checkedInSeatState === seat.split('_')[0] ? 'Your Infant Chair' : 'Infant' } else if (seat.split('_')[1] === 'w') { return checkedInSeatState === seat.split('_')[0] ? 'Your Wheel Chair' : 'Wheel Chair' } else if (seat.split('_')[1] === 'r') { return checkedInSeatState === seat.split('_')[0] ? 'Your Infant with Wheel Chair' : 'Infant with Wheel Chair' } })()}</h3>
										</div>
									</div>
								</div> : ''}
							</li>
						</>) : '')}
					</ol>
				</li>
				<li key={style.planeRow + 'D'} className={`${style.planeRow}`}>
					<ol key={'D'} className={style.seatItems} type="D">
						{seatState.map((s, i) => i === 3 ? s.map((seat, l) =>
							<><li className={style.seatItem} key={s + i + l + 0}>
								<input type="checkbox" disabled={seat.split('_')[1] === undefined ? false : true} onClick={reserveSeat} className={(() => { if (seat.split('_')[1] === 'o') { return style.seatOccupied } else if (seat.split('_')[1] === 'i') { return style.seatInfant } else if (seat.split('_')[1] === 'w') { return style.seatWheelChair } else if (seat.split('_')[1] === 'r') { return style.seatInfChair } })()} ref={ref => (seatRef.current[seat] = ref)} key={s + l} id={seat} />
								<label style={checkedInSeatState === seat.split('_')[0] ? { background: '#4051B5' } : {}} key={seat + 504} htmlFor={seat}>{seat}</label>{seat.split('_')[1] !== undefined ? <div key={seat + 404 + l} className={style.toolTip}>
									<div key={seat + 3 + i} className={style.toolTipRight}>
										<div key={seat + i + l + 4} className={style.textContent}>
											<h3 key={l + seat + 0}>{(() => { if (seat.split('_')[1] === 'o') { return checkedInSeatState === seat.split('_')[0] ? 'Your occupied Chair' : 'Occupied' } else if (seat.split('_')[1] === 'i') { return checkedInSeatState === seat.split('_')[0] ? 'Your Infant Chair' : 'Infant' } else if (seat.split('_')[1] === 'w') { return checkedInSeatState === seat.split('_')[0] ? 'Your Wheel Chair' : 'Wheel Chair' } else if (seat.split('_')[1] === 'r') { return checkedInSeatState === seat.split('_')[0] ? 'Your Infant with Wheel Chair' : 'Infant with Wheel Chair' } })()}</h3>
										</div>
									</div>
								</div> : ''}
							</li>
						</>) : '')}
					</ol>
				</li>
				<li key={style.planeRow + 'E'} className={`${style.planeRow}`}>
					<ol key={'E'} className={style.seatItems} type="E">
						{seatState.map((s, i) => i === 4 ? s.map((seat, l) =>
							<><li className={style.seatItem} key={s + i + l + 0}>
								<input type="checkbox" disabled={seat.split('_')[1] === undefined ? false : true} onClick={reserveSeat} className={(() => { if (seat.split('_')[1] === 'o') { return style.seatOccupied } else if (seat.split('_')[1] === 'i') { return style.seatInfant } else if (seat.split('_')[1] === 'w') { return style.seatWheelChair } else if (seat.split('_')[1] === 'r') { return style.seatInfChair } })()} ref={ref => (seatRef.current[seat] = ref)} key={s + l} id={seat} />
								<label style={checkedInSeatState === seat.split('_')[0] ? { background: '#4051B5' } : {}} key={seat + 505} htmlFor={seat}>{seat}</label>{seat.split('_')[1] !== undefined ? <div key={seat + 505 + l} className={style.toolTip}>
									<div key={seat + 4 + i} className={style.toolTipRight}>
										<div key={seat + i + l + 5} className={style.textContent}>
											<h3 key={l + seat + 0}>{(() => { if (seat.split('_')[1] === 'o') { return checkedInSeatState === seat.split('_')[0] ? 'Your occupied Chair' : 'Occupied' } else if (seat.split('_')[1] === 'i') { return checkedInSeatState === seat.split('_')[0] ? 'Your Infant Chair' : 'Infant' } else if (seat.split('_')[1] === 'w') { return checkedInSeatState === seat.split('_')[0] ? 'Your Wheel Chair' : 'Wheel Chair' } else if (seat.split('_')[1] === 'r') { return checkedInSeatState === seat.split('_')[0] ? 'Your Infant with Wheel Chair' : 'Infant with Wheel Chair' } })()}</h3>
										</div>
									</div>
								</div> : ''}
							</li>
						</>) : '')}
					</ol>
				</li>
				<li key={style.planeRow + 'F'} className={`${style.planeRow}`}>
					<ol key={'F'} className={style.seatItems} type="F">
						{seatState.map((s, i) => i === 5 ? s.map((seat, l) =>
							<><li className={style.seatItem} key={s + i + l + 0}>
								<input type="checkbox" disabled={seat.split('_')[1] === undefined ? false : true} onClick={reserveSeat} className={(() => { if (seat.split('_')[1] === 'o') { return style.seatOccupied } else if (seat.split('_')[1] === 'i') { return style.seatInfant } else if (seat.split('_')[1] === 'w') { return style.seatWheelChair } else if (seat.split('_')[1] === 'r') { return style.seatInfChair } })()} ref={ref => (seatRef.current[seat] = ref)} key={s + l} id={seat} />
								<label style={checkedInSeatState === seat.split('_')[0] ? { background: '#4051B5' } : {}} key={seat + 506} htmlFor={seat}>{seat}</label>{seat.split('_')[1] !== undefined ? <div key={seat + 606 + l} className={style.toolTip}>
									<div key={seat + 5 + i} className={style.toolTipRight}>
										<div key={seat + i + l + 6} className={style.textContent}>
											<h3 key={l + seat + 0}>{(() => { if (seat.split('_')[1] === 'o') { return checkedInSeatState === seat.split('_')[0] ? 'Your occupied Chair' : 'Occupied' } else if (seat.split('_')[1] === 'i') { return checkedInSeatState === seat.split('_')[0] ? 'Your Infant Chair' : 'Infant' } else if (seat.split('_')[1] === 'w') { return checkedInSeatState === seat.split('_')[0] ? 'Your Wheel Chair' : 'Wheel Chair' } else if (seat.split('_')[1] === 'r') { return checkedInSeatState === seat.split('_')[0] ? 'Your Infant with Wheel Chair' : 'Infant with Wheel Chair' } })()}</h3>
										</div>
									</div>
								</div> : ''}
							</li>
						</>) : '')}
					</ol>
				</li>
			</ol>
			<div key={style.planeRow + 'ABCDEF'} className={`${style.exit} ${style.exitBack} ${style.fuselage}`}></div>
		</div>
	)
}
  
SeatPlan.propTypes = {
	onCheckedSeat: PropTypes.func.isRequired,
	passenger: PropTypes.array.isRequired,
  	flights: PropTypes.array.isRequired,
	flightNumber: PropTypes.string.isRequired,
	login: PropTypes.array.isRequired,
	adminEditPassenger: PropTypes.array
};

export default SeatPlan;
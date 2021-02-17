/* eslint-disable no-alert */
import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from "react-router";
import ProgressBar from '../ProgressBar';
import { bindActionCreators } from 'redux';
import * as loginActions from '../../actions/loginActions';
import * as flightActions from '../../actions/flightActions';
import * as passengerActions from '../../actions/passengerActions';
import MenuBar from '../MenuBar';
import style from '../../styles/main.scss';

/**
 * Lazy loading of the flight list.
 */
const FlightList = React.lazy(() => import('./FlightList'));

/**
 * Flights class covers the flightlist component and givs possibilities
 * to admin and passenger to choose the current flight for edit or Check-In.
 * 
 * @typedef {object} Props
 * @prop {array} login
 * @prop {array} flight
 * @prop {array} passenger
 * @prop {object} actions
 *
 * @extends {Component<Props>}
 * @return {React.ReactElement}
 */
class Flights extends React.Component {
  state = {
    ...this.props
  }
  componentDidMount() {
    const { flights, passengers, login, actions } = this.props;

    if (login.length === 0) {
      actions.loadLogin().catch((error) => {
        alert(`Login data failed${error}`);
      });
    }

    if (flights.length === 0) {
      actions.loadFlights().catch((error) => {
        alert(`Loading flights failed${error}`);
      });
    }

    if (passengers.length === 0) {
      actions.loadPassengers().catch((error) => {
        alert(`Loading passengers failed${error}`);
      });
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (!this.props.loading && prevState.login !== prevProps.login) {
      this.setState({ ...this.props });
    }
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
    const { flights, login, history } = this.props;
    return (
      <>
        {this.props.loading ? (
          <ProgressBar />
        ) : (
          <Suspense fallback={<ProgressBar />}>
              {
                <>
                  <MenuBar
                    login={login}
                    handleMenuChange={this.handleMenuChange}
                    history={history}
                  />
                  <div className={style.aaContainer}>
                    <div className={`${style.aaWrapper} ${style.aaWrapperFlights}`}>
                      <h2>Airline Flight Schedules</h2>
                      <FlightList
                        flights={flights}
                        login={login}
                      />
                    </div>
                  </div>
                </>
              }
          </Suspense>
            )}  
      </>
    );
  }
}

Flights.propTypes = {
  login: PropTypes.array.isRequired,
  flights: PropTypes.array.isRequired,
  passengers: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    flights: state.flights.map((flight) => ({
      ...flight,
    })),
    loading: state.apiCallsInProgress > 0,
    passengers: state.passengers,
    login: state.login
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      loadLogin: bindActionCreators(loginActions.loadLogin, dispatch),
      setLogin: bindActionCreators(loginActions.setLogin, dispatch),
      loadFlights: bindActionCreators(flightActions.loadFlights, dispatch),
      loadPassengers: bindActionCreators(passengerActions.loadPassengers, dispatch)
    },
  };
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Flights));

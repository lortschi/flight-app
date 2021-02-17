import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { toast } from 'react-toastify';
import style from '../../styles/main.scss';

/**
 * FlightList functional component covers all scheduled flights.
 * 
 * @prop {array} flights
 * @prop {array} login
 * 
 * @param {array} flights array object of all flights
 * @param {array} login array object of user logins
 * 
 * @return {React.ReactElement}
 */
const FlightList = ({ flights, login }) => {
  const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    table: {
      minWidth: 650,
    },
  }));

  const [loggedIn, setLogin] = useState();

  useEffect(() => {
    changeValue();
  }, [login]);

  useEffect(() => {
    if (loggedIn === undefined) {
      return;
    }

    if (!loggedIn) {
      toast.success('Welcome Passenger to the scheduled flights list!');
      return;
    }
    if (loggedIn) {
      toast.success('You are logged in as Admin!');
    }
  }, [loggedIn]);

  const changeValue = useCallback(() => {
    setLogin(login[0].loggedIn);
  }, [loggedIn]); 

  const classes = useStyles();
  return (
    <TableContainer className={style.flightTable}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead className={style.flightTableHeadWrapper}>
          <TableRow>
            <TableCell className={style.flightTableHead}>Flight number</TableCell>
            <TableCell className={style.flightTableHead}>AirCraft</TableCell>
            <TableCell className={style.flightTableHead}>From</TableCell>
            <TableCell className={style.flightTableHead}>To</TableCell>
            <TableCell className={style.flightTableHead}>{!login[0].loggedIn ? 'Check-In' : 'Admin'}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {flights.map((flight) => (
              <TableRow key={flight.id}>
                <TableCell>{flight.flightNumber}</TableCell>
                <TableCell>{flight.airCraftType}</TableCell>
                <TableCell>{flight.from}</TableCell>
                <TableCell>{flight.to}</TableCell>
              { !login[0].loggedIn ? <TableCell>
                  <Link
                    to={{
                      pathname: `/register/${flight.flightNumber}`,
                      type: 'checkIn',
                    }}
                    style={{ textDecoration: 'none' }}
                  >
                    <Button
                      variant="outlined"
                      color="primary"
                    >
                      CHECK IN
                      </Button>
                  </Link>
                </TableCell> : <TableCell>
                  <Link
                    to={{
                      pathname: `/register/${flight.flightNumber}`,
                      type: 'checkIn',
                    }}
                    style={{ textDecoration: 'none' }}
                  >
                    <Button
                      variant="outlined"
                      color="secondary"
                    >
                      EDIT FLIGHT
                      </Button>
                  </Link>
                </TableCell>}
              </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

FlightList.propTypes = {
  flights: PropTypes.array.isRequired,
  login: PropTypes.array.isRequired
};

export default FlightList;

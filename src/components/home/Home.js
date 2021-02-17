import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Button } from '@material-ui/core';
import style from '../../styles/main.scss';

/**
 * The Home component function screen of the app.
 * From here can start the pasenger it's journey. The possible ways are to login
 * as admin and continue adding / editing passengers or as simple passenger Check-In
 * to a flight.
 */
const Home = () => (
  <div className={style.aaContainer}>
    <div className={style.aaWrapper}>
      <h2>Airline App</h2>
      <Grid container spacing={8} direction="column" alignItems="center">
        <Grid container className={style.aaButtonsContainer} alignItems="center">
          <Link to="flights" style={{ textDecoration: 'none' }}>
            <Button variant="outlined" color="primary">Regular Flights List</Button>
          </Link>
        </Grid>
        <Grid container className={style.aaButtonsContainer} alignItems="center">
          <Link to="login" style={{ textDecoration: 'none' }}>
            <Button variant="outlined" color="primary">Login Admin</Button>
          </Link>
        </Grid>
      </Grid>
    </div>
  </div>
);

export default Home;

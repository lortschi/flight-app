import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ProgressBar from '../ProgressBar';
import { bindActionCreators } from 'redux';
import * as loginActions from '../../actions/loginActions';
import { withRouter } from 'react-router';
import { Grid, TextField, Button } from '@material-ui/core';
import { Face, Fingerprint } from '@material-ui/icons';
import FacebookLoginWithButton from 'react-facebook-login';
import { toast } from 'react-toastify';
import style from '../../styles/main.scss';

/**
 * LoginForm Class
 * Handles the admin login to the app. Possible logins are regular
 * user / password and Facebook OAuth login. To minimize the task overhead, the
 * registry section isn't exist. So just use the hardcoded user credention from
 * the database: U:airline@app.com, PW: airlineapp123*
 * 
 * @typedef {object} Props
 * @prop {array} login
 * @prop {object} actions
 *
 * @extends {Component<Props>}
 * @return {React.ReactElement}
 */
class LoginForm extends Component {

    componentDidMount() {
        const { login, actions } = this.props;
        
        if (login.length === 0) {
            actions.loadLogin().catch((error) => {
                alert(`Loading login failed${error}`);
            });
        }
    }

    /**
     * Handles the login to the app.
     * 
     * @param {HTMLElement} event 
     * @return {undefined}
     */
    onLogin = (event) => {
        const { login, actions, history } = this.props;
        let user = false;
        let pw = false;

        if (event !== undefined && event.name === undefined) {
            actions.loadLogin().then(() => {
                if (login[0].name === event.target[0].value) {
                    user = true;
                }
                if (login[0].password === event.target[1].value) {
                    pw = true;
                }

                if (user && pw) {
                    actions.setLogin([{
                        id: 1,
                        name: event.target[0].value,
                        password: event.target[1].value,
                        loggedIn: true
                    }]).then(() => {
                        actions.loadLogin().then(() => {
                            history.push('/flights');
                        });
                    });
                } else {
                    toast.error('Your Username or Password is incorrect! Please try it again.');
                }
            });
            return;
        }

        if (login.length > 0) {
            actions.setLogin([{
                id: 1,
                name: login[0].name,
                password: login[0].password,
                loggedIn: true
            }]).then(() => {
                actions.loadLogin().then(() => {
                    history.push('/flights');
                });
            });
        }
    }

    render() {
        return (
            <>
                {this.props.loading ? (
                    <ProgressBar />
                ) : (
                    <div className={style.aaContainer}>
                        <div className={style.aaWrapper}>
                            <h3>Admin Login</h3>
                            <form onSubmit={this.onLogin}>
                                <Grid container spacing={8} alignItems="flex-end">
                                    <Grid item>
                                        <Face />
                                    </Grid>
                                    <Grid item>
                                        <TextField
                                            id="username"
                                            label="Username"
                                            type="email"
                                            fullWidth
                                            autoFocus
                                            required
                                        />
                                    </Grid>
                                    </Grid>
                                        <Grid container spacing={8} alignItems="flex-end">
                                        <Grid item>
                                            <Fingerprint />
                                        </Grid>
                                        <Grid item>
                                            <TextField
                                                id="username"
                                                label="Password"
                                                type="password"
                                                fullWidth
                                                required
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={8} direction="column" alignItems="center">
                                    <Grid className={style.aaButtonsContainer} style={{ marginTop: '10px' }}>
                                        <Button
                                            type="submit"
                                            variant="outlined"
                                            color="primary"
                                            style={{ textTransform: "none" }}
                                        >
                                            Login
                                        </Button>
                                    </Grid>
                                    <Grid className={style.aaButtonsContainer, style.aaFBButtonContainer} style={{ marginTop: '10px' }}>
                                        <FacebookLoginWithButton
                                            appId="131175528785829"
                                            autoLoad={false}
                                            fields="name, email, picture"
                                            callback={this.onLogin}
                                            icon="fa-facebook"
                                        />
                                    </Grid>
                                    <footer>
                                        <div>Admin Username: airline@app.com | Password: airlineapp123*</div>
                                        <div>- For Facebook please use the following logins in the popup -</div>
                                        <div>Email: airline_lkwahyo_app@tfbnw.net | Password: airlineapp123*</div>
                                    </footer>     
                                </Grid>
                            </form>   
                        </div>
                    </div>
                )}
            </>
        );
    }
}

LoginForm.propTypes = {
    login: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        login: state.login.map((login) => ({
            ...login,
        })),
        loading: state.apiCallsInProgress > 0
    };
}
  
function mapDispatchToProps(dispatch) {
    return {
      actions: {
            loadLogin: bindActionCreators(loginActions.loadLogin, dispatch),
            setLogin: bindActionCreators(loginActions.setLogin, dispatch)
      }
    };
}
  
  export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps,
  )(LoginForm));

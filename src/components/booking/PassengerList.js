import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import MUIDataTable from "mui-datatables";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import style from '../../styles/main.scss';

/**
 * PassengerList function component displays the table of all passengers on the
 * current fligth. It restricts due to passenger to show the Checked-In one and
 * grant the privilege to admin to see all passengers on the current flight.
 *  
 * @typedef {object} Props
 * @prop {string} flightNumber
 * @prop {array} login
 * @prop {array} flights
 * 
 * @param {array} passenger array object of all flights
 * @param {string} flightNumber the current flight number
 * @param {array} login array object of user logins
 * @param {function} adminEditPassenger callback
 * 
 * @extends {Component<Props>}
 * @return {React.ReactElement}
 */
const PassengerList = ({ passenger, flightNumber, login, adminEditPassenger }) => {
    const [responsive, setResponsive] = useState("vertical");
    const [flightPassengers, setFlightPassengers] = useState([]);
    const [data, setData] = useState([]);
    const [loggedIn, setLogin] = useState(false);

    const getMuiTheme = () => createMuiTheme({
        overrides: {
            MUIDataTable: {
                root: {
                },
                paper: {
                    boxShadow: "none",
                }
            },
            MUIDataTableBodyRow: {
                root: {
                    '&:nth-child(odd)': {
                        backgroundColor: '#F5F5F7'
                    }
                }
            },
            MuiToolbar: {
                root: {
                  backgroundColor: '#d6dbe6'
                }
            },
            MUIDataTableBodyCell: {
            }
        }
    });

    const columns = [{
        name: "name",
        label: "Name",
            options: {
                filter: true,
                sort: true,
            }
        }, {
            name: "surname",
            label: "Surname",
            options: {
                filter: true,
                sort: true,
            }
        }, {
            name: "passportNumber",
            label: "Passport No.",
            options: {
                filter: true,
                sort: true,
            }
        }, {
            name: "seat",
            label: "Seat",
            options: {
                filter: true,
                sort: true,
            }
        }, {
            name: "dateOfBirth",
            label: "Date Of Birth",
            options: {
                filter: true,
                sort: true,
            }
        }, {
            name: "address",
            label: "Address",
            options: {
                filter: true,
                sort: true,
            }
        }, {
            name: "priorityBoarding",
            label: "Prio Boarding",
            options: {
                filter: true,
                sort: true,
            }
        }, {
            name: "specialMeals",
            label: "Special Meals",
            options: {
                filter: true,
                sort: true,
            }
        }, {
            name: "shoppingItems",
            label: "Shopping Items",
            options: {
                filter: true,
                sort: true,
            }
        }, {
            name: loggedIn ? "Edit" : "",
            options: {
                filter: true,
                sort: false,
                empty: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    if (!loggedIn) {
                        return;
                    }
                    return (
                        <>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => adminEditPassenger(tableMeta.rowData)}
                            >
                                Edit
                            </Button>
                        </>
                    );
                }
            }
        }
    ];

    const options = {
        filter: true,
        filterType: 'dropdown',
        responsive,
        tableBodyMaxHeight: '300px',
        tableBodyWidth: '70%',
        print: false,
        download: false,
        viewColumns: false,
        rowHover: false,
        selectableRows: false,
        pagination: data.length > 10 ? true : false,
        textLabels: {
            body: {
                noMatch: 'On this plane is yet no passenger Checked-In.'
            }
        }
    };

    /**
     * GetPassangersOnThisFlight handles the passenger restriction
     * to passenger in the table.
     * 
     * @return {undefined}
     * @return {array} pass as passenger 
     */
    const getPassangersOnThisFlight = () => {
        if (login.length < 1) {
            return;
        }
        setLogin(login[0].loggedIn);

        if (localStorage.getItem('checkedIn')) {
            const currentCheckedInPassenger = JSON.parse(localStorage.getItem('checkedIn'));

            const currentCheckedInPassengerOnThisFlight = passenger.map(pass => {
                if (pass.flightNumber === flightNumber && (pass.passportNumber === currentCheckedInPassenger.passportNumber || pass.name === currentCheckedInPassenger.name)) {
                    return pass;
                }
            }).filter(x => x);

            !login[0].loggedIn ? setFlightPassengers(currentCheckedInPassengerOnThisFlight) : '';
        }
   
        const allPAssangersOnThisFlight = passenger.map(pass => {
            if (pass.flightNumber === flightNumber) {
                return pass;
            }
        }).filter(x => x);

        login[0].loggedIn ? setFlightPassengers(allPAssangersOnThisFlight) : '';
    }

    useEffect(() => {
        getPassangersOnThisFlight();
    }, [login, flightNumber, passenger]);

    useEffect(() => {
        const tableData = flightPassengers.map(obj => {
            obj.seat = obj.seat.split('_')[0];
            obj = obj.passportNumber ? { ...obj, passportNumber: obj.passportNumber } : { ...obj, passportNumber: '- empty -' }
            obj = obj.address ? { ...obj, address: JSON.parse(JSON.stringify(`${obj.address.street}, ${obj.address.city.substring(0, 3)}., ${obj.address.country.substring(0, 3)}.`)) } : { ...obj, address: '- empty -' }
            obj = obj.ancillaryServices.priorityBoarding ? { ...obj, priorityBoarding: 'yes' } : { ...obj, priorityBoarding: 'no' }
            obj = obj.ancillaryServices.specialMeals ? { ...obj, specialMeals: obj.ancillaryServices.specialMeals } : { ...obj, specialMeals: 'regular' }
            obj = obj.ancillaryServices.shoppingItems ? { ...obj, shoppingItems: 'yes' } : { ...obj, shoppingItems: 'no' }
            return obj;
        });

        setData(tableData);
    }, [flightPassengers]);

    return (
        <React.Fragment>
            <h1 className={style.userBoardTitle}>
                {loggedIn ? 'Admin Edit Flight' : 'Passenger\'s Check-In'}
            </h1>
            <div className={style.userBoardSubtitle}>
                {loggedIn ? 'As admin you are able to add new one or even edit already checked-in passengers.' : 'Please check-in as passenger to this flight.'}
            </div>
            {loggedIn || data.length > 0 ? <MuiThemeProvider theme={getMuiTheme()}>
                <MUIDataTable
                    className={style.MuiDatatable}
                    title={loggedIn ? 'Edit Checked-In Passengers' : 'Checked-In Passenger'}
                    data={data || []}
                    columns={columns}
                    options={options}
            /></MuiThemeProvider>: ''}
        </React.Fragment>
    );
}

PassengerList.propTypes = {
    passenger: PropTypes.array.isRequired,
    flightNumber: PropTypes.string.isRequired,
    login: PropTypes.array.isRequired
};

export default PassengerList;


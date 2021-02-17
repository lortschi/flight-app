import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

/**
 * MenuBar function component handles admin log-in / out possibility
 * in the left upper corner of the app.
 * 
 * @param {array} login
 * @param {function} handleMenuChange
 * @param {object} history
 * 
 * @return {React.ReactElement}
 */
const MenuBar = ({ login, handleMenuChange, history }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    
    const handleFlights = () => { 
        history.push('/');
    }

    return (
        <div>
            <Button
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClick}
            >
                Admin Menu
            </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleFlights}>Home</MenuItem>
                <MenuItem
                    onClick={handleMenuChange}
                    login={login}
                >
                    { login[0] !== undefined && login[0].loggedIn ? 'Admin Logout' : 'Admin Login' }
                </MenuItem>
            </Menu>
        </div>
    );
}
export default MenuBar;
  



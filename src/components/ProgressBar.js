import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import style from '../styles/main.scss';

/**
 * PrgressBar function component shows the loading circle
 * by lazy rendering of all components.
 *
 * @return {React.ReactElement}
 */
const ProgressBar = () => {
    return (
        <div className={style.circularProgress}>
            <CircularProgress
                className={style.circularProgressCircle}
            />
        </div>
    );
}

export default ProgressBar;
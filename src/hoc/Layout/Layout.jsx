import React from 'react';
import classes from './Layout.module.scss';

const Layout = (props) => {

    return(
        <div className={classes['Layout']}>
            {/* <header>
            </header> */}
            <main>
            {props.children}
            </main>
            {/* <footer>
            </footer> */}
        </div>
    )
}

export default Layout;
import React from 'react';
import {NavItem, Navbar, Nav} from 'reactstrap';
import {Link} from 'react-router-dom';
import grey from '@material-ui/core/colors/grey';
import PropTypes from 'prop-types';
import { Fragment } from 'react';

const Header = (props) => {
    const headerColor = grey[700];
    return(
        <Navbar position="static" style={{backgroundColor: headerColor}}>
            {props.login ? 
                <Fragment>
                    <Nav>
                        <NavItem style={{color: '#FFFF', fontSize:'20px'}}>
                            Welcome, {props.username}
                        </NavItem>
                    </Nav>
                    <span style={{color: '#F6C344', fontSize:'30px'}}>
                        Contact Manager
                    </span>
                    <Nav>
                        <NavItem>
                            <Link to="/" style={{fontSize:'20px'}} className="logout"> Logout</Link>
                        </NavItem>
                    </Nav>
                </Fragment>
                 :
                <h3 className="mx-auto" style={{color: '#F6C344'}}>
                    Contact Manager
                </h3>
            
            }
        </Navbar>
    )
}

Header.propTypes = {
    login: PropTypes.bool,
    username: PropTypes.string.isRequired
}

export default Header;
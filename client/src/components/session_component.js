import React, { Component } from "react";
import axios from "axios";
import { Link, Redirect } from "react-router-dom";

import {
    getFromStorage,
    setInStorage
} from '../utils/storage';

export default class Session extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            token: '',
            signUpError: '',
            signInError: ''
        };
    }

    componentDidMount() {
        const token = getFromStorage('the_main_app');
        if(token) {
            // Verify token
            axios
                .get("/api/users/verify" + token)
                .then(res => res.json())
                .then(json => {
                    if (json.success) {
                        this.setState({
                            token: token,
                            isLoading: false
                        });
                    } else {
                        this.setState({
                            isLoading: false
                        });
                    }
                });
        } else {
            this.setState({
                isLoading: false,
            });
        }
    }

    render() {
        const {
			isLoading,
			token
        } = this.state;

        if(isLoading) {
            return (<div><p>Loading...</p></div>);
		}
		if(!token) {
			return (<div>
				<Link to="/register" className="registerLink">
              		Sign up
            	</Link>
				<Link to="/login" className="loginLink">
              		Sign in
            	</Link>
			</div>
			);
		}
        return (
            <div>
				<p>Account</p>
            </div>
        );
    }
}
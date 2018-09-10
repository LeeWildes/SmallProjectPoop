import React, {Component} from 'react';
import {Alert, Form, FormGroup, Label, Input, Container, Button} from 'reactstrap';
import {Redirect} from 'react-router-dom';
import Header from './Header';

class Login extends Component{
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
            redirect: false
        }
    }

    getInfo = (e, inputField) => {
        this.setState({
            [inputField]: e.target.value
        })
    }

    checkLogin() {
        fetch(`http://127.0.0.1:5000/api/login=${this.state.username}&${this.state.password}`)
        .then(response => response.json())
        .then(responseData => {
            if(responseData.success){
                this.setRedirect();
            }
            else{
                return(
                    <Alert color="danger">
                        {responseData.message}
                    </Alert>
                )
            }
        })
    }
    

    setRedirect = () => {
        this.setState({
            redirect: true
        })
    }

    redirectTo(){
        if(this.state.redirect){
            return(
                <Redirect to={{
                    pathname: '/home',
                    state: {username: this.state.username}
                }}/>
            );
        }
        else return null
    }

    createUser(){
        var user = {
            username: this.state.username,
            password: this.state.password
        }
        fetch(`http://127.0.0.1:5000/api/create_user=${user.username}&${user.password}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(response => console.log('Success:', JSON.stringify(response)))
        .catch(error => console.error('Error:', error));
        return(
            <Alert color="success">
                Successfull created user!
            </Alert>
        )
    }


    render(){
        return(
            <div className="App">
                <Header login={false} username={this.state.username}/>
                <Container style={{width:'40vw'}} className="mt-5">
                    <Form>
                        <FormGroup>
                            <Label for="exampleEmail">Username</Label>
                            <Input onChange={(e) => this.getInfo(e, "username")} type="username" name="username" id="exampleEmail"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="examplePassword">Password</Label>
                            <Input onChange={(e) => this.getInfo(e, "password")} type="password" name="password" id="examplePassword"/>
                        </FormGroup>
                        <Button color="secondary" block onClick={() => this.createUser()}>
                            Create User
                        </Button>
                        <Button color="warning" block onClick={() => this.checkLogin()}>
                            Login
                        </Button>
                        {this.redirectTo()}
                    </Form>
                </Container>
            </div>
        )
    }
}

export default Login;

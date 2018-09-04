import React, {Component} from 'react';
import {Form, FormGroup, Label, Input, Container, Button} from 'reactstrap';
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
    grabUsername = (e) => {
        this.setState({
            username: e.target.value
        })
    }

    grabPassword = (e) => {
        this.setState({
            password: e.target.value
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

    render(){
        return(
            <div className="App">
                <Header login={false} username={this.state.username}/>
                <Container style={{width:'30vw'}} className="mt-5">
                    <Form>
                        <FormGroup>
                            <Label for="exampleEmail">Username</Label>
                            <Input onChange={(e) => this.grabUsername(e)} type="email" name="email" id="exampleEmail"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="examplePassword">Password</Label>
                            <Input onChange={(e) => this.grabPassword(e)} type="password" name="password" id="examplePassword"/>
                        </FormGroup>
                        <Button color="warning" block type="submit" onClick={this.setRedirect}>
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

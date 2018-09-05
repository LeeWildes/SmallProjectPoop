import React, {Component, Fragment} from 'react';
import {Form, FormGroup, Input, InputGroup, InputGroupAddon, Button} from 'reactstrap';
import Header from './Header';

class Home extends Component{
    constructor(props){
        super(props);
        this.state = {

        }
    }
    render(){
        return(
            <Fragment>
                <Header login={true} username={this.props.location.state.username}/>
                <Form className="w-50 mx-auto mt-5">
                    <FormGroup className="my-5">
                        <InputGroup>
                            <Input placeholder="Add a contact" />
                            <InputGroupAddon addonType="append"><Button outline color="warning">Add</Button></InputGroupAddon>
                        </InputGroup>
                    </FormGroup>
                    <FormGroup className="my-5">
                        <InputGroup>
                            <Input placeholder="Delete a contact" />
                            <InputGroupAddon addonType="append"><Button outline color="warning">Delete</Button></InputGroupAddon>
                        </InputGroup>
                    </FormGroup>
                    <FormGroup className="my-5">
                        <InputGroup>
                            <Input placeholder="Search for a contact" />
                            <InputGroupAddon addonType="append"><Button outline color="warning">Search</Button></InputGroupAddon>
                        </InputGroup>
                    </FormGroup>
                </Form>
            </Fragment>
        )
    }
}


export default Home;
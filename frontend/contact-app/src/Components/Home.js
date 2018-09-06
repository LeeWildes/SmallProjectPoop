import React, {Component, Fragment} from 'react';
import {UncontrolledAlert, Form, FormGroup, Input, InputGroup, InputGroupAddon, Button} from 'reactstrap';
import Header from './Header';

class Home extends Component{
    constructor(props){
        super(props);
        this.state = {
            addFirst: '',
            addLast: '',
            addNumber: '',
            addEmail: '',
            delete: '',
            search: '',
            contacts: [],
            successDelete: false,
            successAdd: false
        }
        this.getInfo = this.getInfo.bind(this);
        this.deleteContact = this.deleteContact.bind(this);
        this.addContact = this.addContact.bind(this);
        this.showDeleteAlert = this.showDeleteAlert.bind(this);
        this.showAddAlert = this.showAddAlert.bind(this);
    }
    getInfo = (e, stateField) => {
        this.setState({
            [stateField]: e.target.value
        });
    }

    // componentWillMount(){
    //     //grabs the contacts before the component is added to the dom
    //     fetch('/api/contacts')
    //     .then(response => response.json())
    //     .then(responseData => {
    //         const tmpContacts = [];
    //         for(var key in responseData){
    //             const contact = JSON.parse(key);
    //             tmpContacts.push(contact);
    //         }
    //         this.setState({
    //             contacts: tmpContacts
    //         })
    //     })
    //     .catch(error => {
    //         console.log('Error fetching and parsing data.', error);
    //     });
    // }

    deleteContact(){
        var userToDelete = {
            userID: this.state.username,
            firstLast: this.state.delete
        }
        fetch('http://127.0.0.1:5000/api/delete_contact',{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userToDelete)
        })
        .then(response => response.json())
        .then(responseData => {
          if(responseData.success){
            this.setState({
              successDelete: true
            })
          }
        })
        .catch(error => console.error('Error:', error));
    }

    showAddAlert(){
      if(this.state.successAdd){
        return(
          <UncontrolledAlert color="success">
              Successfully added the contact
          </UncontrolledAlert>
        )
      }
      else return null
    }
    showDeleteAlert(){
      if(this.state.successDelete){
        return(
          <UncontrolledAlert color="success">
              Successfully deleted the contact
          </UncontrolledAlert>
        )
      }
      else return null
    }

    addContact(){
        var userToAdd = {
            userID: this.props.location.state.username,
            first: this.state.addFirst,
            last: this.state.addLast,
            number: this.state.addNumber,
            email: this.state.addEmail
        }
        fetch('http://127.0.0.1:5000/api/create_contact', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userToAdd)
        })
        .then(response => response.json())
        .then(responseData => {
            if(responseData.success){
              this.setState({
                successAdd: true
              })
            }
        })
        .catch(error => console.error('Error:', error));
    }

    render(){
        return(
            <Fragment>
                <Header login={true} username={this.props.location.state.username}/>
                <Form className="w-50 mx-auto mt-5">
                    <FormGroup className="my-5">
                        <InputGroup>
                            <Input placeholder="First Name" onChange={(e) => this.getInfo(e, "addFirst")}/>
                            <Input placeholder="Last Name" onChange={(e) => this.getInfo(e, "addLast")}/>
                            <Input placeholder="Phone Number" onChange={(e) => this.getInfo(e, "addNumber")}/>
                            <Input placeholder="Email" onChange={(e) => this.getInfo(e, "addEmail")}/>
                            <InputGroupAddon addonType="append">
                                <Button outline color="warning" onClick={() => this.addContact()}>Add</Button>
                            </InputGroupAddon>
                        </InputGroup>
                    </FormGroup>
                    <FormGroup className="my-5">
                        <InputGroup>
                            <Input placeholder="Delete a contact" onChange={(e) => this.getInfo(e, "delete")}/>
                            <InputGroupAddon addonType="append">
                                <Button outline color="warning" onClick={() => this.deleteContact()}>Delete</Button>
                            </InputGroupAddon>
                        </InputGroup>
                    </FormGroup>
                    <FormGroup className="my-5">
                        <InputGroup>
                            <Input placeholder="Search for a name, number or email" onChange={(e) => this.getInfo(e, "search")}/>
                            <InputGroupAddon addonType="append">
                                <Button outline color="warning">Search</Button>
                            </InputGroupAddon>
                        </InputGroup>
                    </FormGroup>
                    {this.showDeleteAlert()}
                    {this.showAddAlert()}
                </Form>
            </Fragment>
        )
    }
}


export default Home;

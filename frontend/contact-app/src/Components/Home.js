import React, {Component, Fragment} from 'react';
import {UncontrolledAlert, Form, FormGroup, Input, InputGroup, InputGroupAddon, Button, ListGroup, ListGroupItem} from 'reactstrap';
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
            successAdd: false,
            successShow: false,
            contactsDisplayed: true
        }
        this.getInfo = this.getInfo.bind(this);
        this.deleteContact = this.deleteContact.bind(this);
        this.addContact = this.addContact.bind(this);
        this.showDeleteAlert = this.showDeleteAlert.bind(this);
        this.showAddAlert = this.showAddAlert.bind(this);
        this.getContacts = this.getContacts.bind(this);

    }
    getInfo = (e, stateField) => {
        this.setState({
            [stateField]: e.target.value
        });
    }

    getContacts(){
        //grabs the contacts before the component is added to the dom
        fetch(`http://127.0.0.1:5000/api/contacts=${this.props.location.state.username}`)
        .then(response => response.json())
        .then(responseData => {
          console.log(responseData);
            this.setState({
                contacts: responseData,
                successShow: true
            })
            console.log(this.state.contacts[0])
        })
        .catch(error => {
            console.log('Error fetching and parsing data.', error);
        });
        this.setState({contactsDisplayed: false})
    }

    deleteContact(){
        var userToDelete = {
            userID: this.props.location.state.username,
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

    showContacts(){
    if(this.state.successShow){
        if(this.state.contactsDisplayed){
          return
        }
        console.log(this.state.contacts.length)
        var ul = document.getElementById("list");

        // this whie loop clears out the search when another thing is being searched
        while (ul.firstChild) {
          ul.removeChild(ul.firstChild);
        }

        for(var i = 0; i < this.state.contacts.length; i++){
          var contact = this.state.contacts[i].name;
          var number = this.state.contacts[i].number;
          var email = this.state.contacts[i].email;
          var li = document.createElement("ListGroupItem");
          // var li = React.createElement(ListGroupItem, {href: contact}, contact + ' ' + number + ' ' + email);
          li.textContent = contact + ' ' + number + ' ' + email;
          // if(contact.toLowerCase().includes(this.state.search.toLowerCase())){
          if(li.textContent.toLowerCase().includes(this.state.search.toLowerCase())){
              // this is what prints out the info
              ul.append(li)
		      }

        }
        this.setState({contactsDisplayed: true})
      }
      else return null
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
                                <Button outline color="warning" onClick={() => this.getContacts()}>Search</Button>
                            </InputGroupAddon>
                        </InputGroup>
                    </FormGroup>
                    <ListGroup id="list">
                      {this.showContacts()}
                    </ListGroup>
                    {this.showDeleteAlert()}
                    {this.showAddAlert()}
                </Form>
            </Fragment>
        )
    }
}


export default Home;

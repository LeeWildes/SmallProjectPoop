'use strict';

const e = React.createElement;

class LoginButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { login: false };
  }

  render() {
    if (this.state.login) {
      return 'You logged in.';
    }

    return e(
      'button',
      { onClick: () => this.setState({ login: true }) },
      'Log-In'
    );
  }
}

const domContainer = document.querySelector('#login_button_container');
ReactDOM.render(e(LoginButton), domContainer);

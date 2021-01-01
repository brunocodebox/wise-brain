import React from 'react';

// Pure function
// We can destructure onInputChange and onButtonSubmit from the props with {}
// instead of saying props.onInputChange and props.onButtonSubmit.
// These two act like callbacks seen on Flutter app.

// Also, same as the Signin component we want to convert the register component into a class
// to be able to have a state. 
// const Register = ({onRouteChange}) => {
  class Register extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        registerName: '',
        registerEmail: '',
        registerPassword: ''
      }
    }

  // We will listen to name input changes from the user
  onNameChange = event => {
    this.setState({registerName: event.target.value});
  }

  // to email input changes from the user
  onEmailChange = event => {
    this.setState({registerEmail: event.target.value});
  }

  // and listen to password input changes from the user
  onPasswordChange = event => {
    this.setState({registerPassword: event.target.value});
  }

  onSubmitRegister = () => {
    console.log('state at register event: ', this.state);
    console.log('name client : ', this.state.registerName);
    console.log('email client : ', this.state.registerEmail);
    console.log('password client : ', this.state.registerPassword);

    // Fetch the users. 
    // fetch by default makes a GET request but we need a POST
    // to hide the email and password in the body
    fetch('https://obscure-waters-26708.herokuapp.com/register', {
      method: 'post',
      // because content-type is in quote we need to use braces around it
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        name: this.state.registerName,
        email: this.state.registerEmail,
        password: this.state.registerPassword
      }),
    })
    .then(response => response.json())
    // the data returned from the server is the user
    .then(user => {
      // if we get a user back then it was registered
      // Make sure to check an object key such as .id because the database may return nothing
      // but always as an array and an array even empty will make the condition if ([]) true.
      if (user.id) {
        // load this registered user to the app
        this.props.loadUser(user);
        // and show the home page
        this.props.onRouteChange('home');
      }
    });
  }

  render() {
    // const { onRouteChange } = this.props;
    return (
      <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
        <main className="pa4 black-80">
          {/* Replace the form with div because when a form is used and a submit element is inside it, js will automatically try to send the form */}
          <div className="measure">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0">Register</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                <input
                  onChange={this.onNameChange} 
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                  type="test"
                  name="name"
                  id="name"/>
              </div>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                <input
                  onChange={this.onEmailChange} 
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                  type="email" 
                  name="email-address"
                  id="email-address"/>
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                <input
                  onChange={this.onPasswordChange} 
                  className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                  type="password" 
                  name="password" 
                  id="password"/>
              </div>
            </fieldset>
            <div className="">
              <input 
                onClick={this.onSubmitRegister}
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                type="submit" 
                value="Register"/>
            </div>
          </div> 
        </main>
      </article>
    );
  }
}

export default Register;

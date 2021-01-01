import React from 'react';

// Pure function
// We can destructure onInputChange and onButtonSubmit from the props with {}
// instead of saying props.onInputChange and props.onButtonSubmit.
// These two act like callbacks seen on Flutter app.

// Need to convert signin to a smart component and for that we need a state
// To have a state we need to convert signin from a function to a class.
// A class has props and in there there is onRouteChange passed by callers.
// const Signin = ({onRouteChange}) => {
class Signin extends React.Component {

  // To use props we need to pass props
  constructor(props) {
    super(props);
    this.state = {
      signInEmail: '',
      signInPassword: ''
    }
  }

  // We will listen to email input changes from the user
  onEmailChange = event => {
    this.setState({signInEmail: event.target.value});
  }

  // And listen to password input changes from the user
  onPasswordChange = event => {
    this.setState({signInPassword: event.target.value});
  }

  onSubmitSignIn = () => {
    console.log('state at signin event: ', this.state);
    console.log('email client : ', this.state.signInEmail);
    console.log('password client : ', this.state.signInPassword);

    // Fetch the users. 
    // fetch by default makes a GET request but we need a POST
    // to have the email and password in the body
    fetch('https://obscure-waters-26708.herokuapp.com/signin', {
      method: 'post',
      // because content-type is in quote we need to use braces around it
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        email: this.state.signInEmail,
        password: this.state.signInPassword
      }),
    })
    .then(response => response.json())
    .then(user => {
      // check whether the user exist
      if (user.id) {
        this.props.loadUser(user);
        this.props.onRouteChange('home');
      }
    });
  }

  render() {
    const { onRouteChange } = this.props;
    return (
      <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
        <main className="pa4 black-80">
          {/* Replace the form with div because when a form is used and a submit element is inside it, it tries to submit the form */}
          <div className="measure">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0">Sign In</legend>
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
                onClick={this.onSubmitSignIn}
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                type="submit" 
                value="Sign in"/>
            </div>
            <div className="lh-copy mt3">
              <p 
                onClick={ () => onRouteChange('register')}
                className="f6 link dim black db pointer">Register
              </p>
            </div>
          </div>
        </main>
     </article>
    );
  }
}

export default Signin;

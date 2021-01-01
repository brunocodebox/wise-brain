import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';

// This is moved to backend to prevent the key to be displayed in
// the headers under the network tab in the browser developer tab.
// const app = new Clarifai.App({
//   apiKey: 'c8b5e012ebfa422ebf31547c4442db06'
// });

const particleOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
};

// Make sure that the state is clean between user logins and registrtations
const initialState = {
  input: '',
  imageUrl: '',
  faceBox: {},
  route: 'signin',
  isSignedIn: false,
  // the user object is filled when a user registers or signs in
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
};

class App extends Component {
  constructor() {
    super();
    // add a user profile in the app
    this.state = {
      input: '',
      imageUrl: '',
      faceBox: {},
      route: 'signin',
      isSignedIn: false,
      // copy whatever gets returned from the database
      // this is filled when a user registers or signs in
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  // Use React life cycle function
  // Can test the response from the server
  // componentDidMount() {
  //   // Get users from the server's database
  //   // fetch is equivalent to a GET 
  //   fetch('http://localhost:3000/')
  //   .then(response => response.json())
  //   .then(console.log); // same as .then(data => console.log(data));
  // }

  calculateFaceLocation = (data) => {
    console.log('calculate: ', data);
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    console.log(clarifaiFace);
    // Access the DOM to facilitate the position of the box in the image. So for that, give the image an id
    // and get the image element by using this id.
    const image = document.getElementById('inputImage');
    const width = Number(image.width); // image.width and height is a string, so convert them to numbers
    const height = Number(image.height);
    console.log('width: ', width, '  height: ', height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - ( clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    console.log('box param : ', box);
      this.setState({faceBox: box});
  }

  onInputChange = (event) => {
    // To get the value input in the input box need to get to target.value
    console.log(event.target.value);
    this.setState({input: event.target.value});
  }

  onRouteChange = (route) => {
    if (route === 'home') {
      this.setState({isSignedIn: true});
    } else  {
      // Whether the route is signin or signout, clear the state
      this.setState(initialState);
    }
    this.setState({route: route});
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
        entries: data.entries,
      joined: data.joined
    }});
  }

  // The smart-brain-api is hosted on Heroku at https://obscure-waters-26708.herokuapp.com/
  // So must change http://localhost:3000 to https://obscure-waters-26708.herokuapp.com/
  onImageSubmit = () => {
    this.setState({imageUrl: this.state.input});
    // Issue api call to server to check image got processed ok 
    console.log('client image url = ', this.state.input);

    fetch('https://obscure-waters-26708.herokuapp.com/imageUrl', {
      method: 'post',
      // because content-type is in quote we need to use braces around it
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    })
    // There was a successful response from the api call to convert from json
    // console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
    .then(response => response.json())
    .then(response => {
      if (response) {
        // Update the entries count with a put
        fetch('https://obscure-waters-26708.herokuapp.com/image', {
          method: 'put',
          // because content-type is in quote we need to use braces around it
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          }),
        })
        // The image fetch returns the updated image count
        .then(response => response.json())
        .then(count => {
          // The following user syntax will update to a new user with entries only
          // this.setState({user: {
          //   entries: count
          // }});
          // Use the Object assign method instead
          this.setState(Object.assign(this.state.user, {entries: count}));
        })
        // Always have a catch error handling after a .then
        .catch(console.log);
      }
      // There was a successful response
      // console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(error => console.log(error));
  }

  render() {
    const { isSignedIn, imageUrl, route, faceBox } = this.state;
    return (
      <div className="App">
        {/* Curly braces start a Javascript expression. */ }
        {/* Build the components we need */}
        <Particles className='particles'
          params={particleOptions} 
        />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
        { route === 'home'
          ?  <div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onImageSubmit={this.onImageSubmit}/>
              <FaceRecognition faceBox = {faceBox} imageUrl={imageUrl}/>
            </div>
          : route === 'signin'
            ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
       }
      </div>
    );  
  }
}

export default App;

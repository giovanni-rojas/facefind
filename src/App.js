import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FacialRecognition from './components/FacialRecognition/FacialRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import './App.css';

const particleOptions = {
  particles: {  
    number: {
      value: 150,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const initialState = {
  input: '',
  imageUrl: '',
  box: [],
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  // componentDidMount() {
  //   fetch('http://localhost:3001/')
  //     .then(response => response.json())
  //     .then(console.log)  //same as data => console.log(data)
  // }

  loadUser = (data) => {
    this.setState(
      {
        user:
        {
          id: data.id,
          name: data.name,
          email: data.email,
          entries: data.entries,
          joined: data.joined
        }})
  }

  calculateBoxLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;    //bounding box values as percentages
    const image = document.getElementById('inputImage');
    const width = Number(image.width);    //of input image
    const height = Number(image.height);  //of input image
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({ box: box });
    //console.log(box);
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onPictureSubmit = () => {
    this.setState({ imageUrl: this.state.input })
      fetch('http://localhost:3001/imageurl', 
      {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(
        {
          input: this.state.input
        })
      })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('http://localhost:3001/image', 
          {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(
            {
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count })) //somehow magic that updates instead of changes 'user'
            })
            .catch(console.log)
        }
        this.displayFaceBox(this.calculateBoxLocation(response))    //answer: setState is asynchronous, so React hadn't finished updating imageUrl's state. Can fix w/ a callback setState(updater, callback)function(response) {     //from https://www.clarifai.com/models/face-detection-image-recognition-model-a403429f2ddf4b49b307e318f00e528b-detection
      })
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
    }
    else if (route === 'home') {
      this.setState({ isSignedIn: true })
    }
    this.setState({ route: route });
  }

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Particles 
          className='particles'
          params={ particleOptions }
        />
        <Navigation isSignedIn={ isSignedIn } onRouteChange={ this.onRouteChange }/>
        { route === 'home' 
          ? <div>
              <Logo />
              <Rank name={ this.state.user.name } entries={ this.state.user.entries }/>
              <ImageLinkForm 
                onInputChange={ this.onInputChange } 
                onButtonSubmit={ this.onPictureSubmit } />
              <FacialRecognition box={ box } imageUrl={ imageUrl }/>
            </div> 
          : (
              route === 'signin' 
              ? <Signin loadUser={this.loadUser} onRouteChange={ this.onRouteChange } />
              : <Register loadUser={ this.loadUser } onRouteChange={ this.onRouteChange } />
            )
        }
      </div>
    );
  }
}

export default App;
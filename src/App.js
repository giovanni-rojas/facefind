import React, { Component } from 'react';
//import Particles from 'react-particles-js';
import ParticlesBg from 'particles-bg';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FacialRecognition from './components/FacialRecognition/FacialRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import './App.css';

const initialState = {
  input: '',
  imageUrl: '',
  boxes: [],
  route: 'signin',
  //route: 'home',
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


  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateBoxLocation = (data) => {
    const image = document.getElementById('inputImage');
    const width = Number(image.width);    //of input image
    const height = Number(image.height);  //of input image
    return data.map(face => {
      const clarifaiFace = face.region_info.bounding_box;
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      };
    })
  };

  displayFaceBox = (box) => {
    this.setState({ boxes: box });
    //console.log(box);
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    fetch('https://agile-brushlands-08884-f69c8fdf1fe8.herokuapp.com/imageurl', 
    {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(
      {
        input: this.state.input
      }),
    })
    .then(response => response.json())
    .then(result => {
      console.log('hi', result);
      if (result) {
        fetch('https://agile-brushlands-08884-f69c8fdf1fe8.herokuapp.com/image', 
        //fetch('http://localhost:3000/image', 
        {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(
          {
            id: this.state.user.id
          }),
        })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count })) //somehow magic that updates instead of changes 'user'
          })
          .catch(console.log)
      }
      this.displayFaceBox(this.calculateBoxLocation(result))    //answer: setState is asynchronous, so React hadn't finished updating imageUrl's state. Can fix w/ a callback setState(updater, callback)function(response) {     //from https://www.clarifai.com/models/face-detection-image-recognition-model-a403429f2ddf4b49b307e318f00e528b-detection
    })
    .catch(err => console.log("error", err));
  };

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
    const { isSignedIn, imageUrl, route, boxes } = this.state;
    return (
      <div className="App">
        <ParticlesBg type="circle" bg={true} />
        <Navigation isSignedIn={ isSignedIn } onRouteChange={ this.onRouteChange }/>
        { route === 'home' 
          ? <div>
              <Logo />
              <Rank name={ this.state.user.name } entries={ this.state.user.entries }/>
              <ImageLinkForm 
                onInputChange={ this.onInputChange } 
                onButtonSubmit={ this.onButtonSubmit } />
              <FacialRecognition boxes={ boxes } imageUrl={ imageUrl }/>
            </div> 
          : (
              route === 'signin' 
              ? <Signin loadUser={ this.loadUser } onRouteChange={ this.onRouteChange } />
              : <Register loadUser={ this.loadUser } onRouteChange={ this.onRouteChange } />
            )
        }
      </div>
    );

  }
}

export default App;
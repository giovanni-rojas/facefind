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

// const particleOptions = {
//   particles: {  
//     number: {
//       value: 150,
//       density: {
//         enable: true,
//         value_area: 800
//       }
//     }
//   }
// }

// const app = new Clarifai.App( {
//   apiKey: 'a8614656d9214e8cb4ecc3765e376f3f'
// });

const returnClarifaiRequestOptions = (imageUrl) => {

  // Your PAT (Personal Access Token) can be found in the Account's Security section
  const PAT = '03c4f8ee2959479d872414840f56bb94';
  // Specify the correct user_id/app_id pairings
  // Since you're making inferences outside your app's scope
  const USER_ID = 'dd7dgnk1wn7b';       
  const APP_ID = 'test-face-detect';
  // Change these to whatever model and image URL you want to use
  const MODEL_ID = 'face-detection';   
  const IMAGE_URL = imageUrl;

  const raw = JSON.stringify({
    "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": IMAGE_URL
                }
            }
        }
    ]
  });

  const requestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
    },
    body: raw
  };

  return requestOptions;

}

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
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

  componentDidMount() {
    fetch('https://agile-brushlands-08884-f69c8fdf1fe8.herokuapp.com/')
      .then(response => response.json())
      .then(console.log)  //same as data =>s console.log(data)
  }

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

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });

    
    fetch("http://api.clarifai.com/v2/models/" + 'face-detection' + "/outputs", returnClarifaiRequestOptions(this.state.input))
      
    // fetch('http://localhost:3000/imageurl', 
    // {
    //   method: 'post',
    //   headers: {'Content-Type': 'application/json'},
    //   body: JSON.stringify(
    //   {
    //     input: this.state.input
    //   })
    // })

    .then(response => response.json())
    .then(response => {
      console.log('hi', response)
      if (response) {
        fetch('https://agile-brushlands-08884-f69c8fdf1fe8.herokuapp.com/image', 
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

      // app.models.predict('face-detection', this.state.input)
      //   .then(response => {
      //     console.log('hi', response)
      //     if (response) {
      //       fetch('http://localhost:3001/image', {
      //         method: 'put',
      //         headers: {'Content-Type': 'application/json'},
      //         body: JSON.stringify({
      //           id: this.state.user.id
      //         })
      //       })
      //         .then(response => response.json())
      //         .then(count => {
      //           this.setState(Object.assign(this.state.user, { entries: count}))
      //         })
      //     }
      //     this.displayFaceBox(this.calculateBoxLocation(response))
      //   })
      //   .catch(err => console.log(err));
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
        <ParticlesBg type="circle" bg={true} />
        <Navigation isSignedIn={ isSignedIn } onRouteChange={ this.onRouteChange }/>
        { route === 'home' 
          ? <div>
              <Logo />
              <Rank name={ this.state.user.name } entries={ this.state.user.entries }/>
              <ImageLinkForm 
                onInputChange={ this.onInputChange } 
                onButtonSubmit={ this.onButtonSubmit } />
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
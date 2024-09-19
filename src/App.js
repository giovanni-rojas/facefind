import React, { Component } from 'react';
import ParticlesBg from 'particles-bg';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FacialRecognition from './components/FacialRecognition/FacialRecognition';
import './App.css';

const initialState = {
  input: '',
  imageUrl: '',
  boxes: [],
  file: null,
  submissionCount: sessionStorage.getItem('submissionCount') ? parseInt(sessionStorage.getItem('submissionCount')) : 0
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
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

  displayFaceBox = (boxes) => {
    this.setState({ boxes });
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value, file:null });
  }

  onFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.setState({ input: '', file: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  onButtonSubmit = () => {
    const { input, file } = this.state;
    const data = file ? { file } : { input };
    fetch('https://agile-brushlands-08884-f69c8fdf1fe8.herokuapp.com/imageurl', 
    {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
      if (result) {
        this.displayFaceBox(this.calculateBoxLocation(result));
        this.setState(prevState => {
          const newCount = prevState.submissionCount + 1;
          sessionStorage.setItem('submissionCount', newCount);  // Save to sessionStorage
          return { submissionCount: newCount };
        });
      }
    })
    .catch(err => console.log('Error:', err));
  };

  render() {
    const { input, imageUrl, boxes } = this.state;
    return (
      <div className="App">
        <ParticlesBg color="#d6d6d6" type="cobweb" bg={true} /> 
        <Logo />
        <ImageLinkForm 
          onInputChange={ this.onInputChange } 
          onButtonSubmit={ this.onButtonSubmit }
          onFileUpload={this.onFileUpload} />
        <h1>Submission Count: {this.state.submissionCount}</h1>
        <FacialRecognition boxes={ boxes } imageUrl={ imageUrl }/>
      </div>
    );

  }
}

export default App;
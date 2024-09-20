import React, { Component } from 'react';
import ParticlesBg from 'particles-bg';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FacialRecognition from './components/FacialRecognition/FacialRecognition';
import imageCompression from 'browser-image-compression';
import './App.css';

const initialState = {
  input: '',
  imageUrl: '',
  boxes: [],
  submissionCount: sessionStorage.getItem('submissionCount') ? parseInt(sessionStorage.getItem('submissionCount')) : 0
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      ...initialState,
      file:null,
    };
  }

  onFileChange = async (event) => {
    const file = event.target.files[0];
    const options = {
      maxSizeMB: 1,          // Limit the file size to 1MB
      maxWidthOrHeight: 800, // Adjust to your preference
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.onloadend = () => {
        this.setState({ file: reader.result });
      };
      reader.readAsDataURL(compressedFile);  // Convert compressed file to base64
    } catch (error) {
      console.error('Error compressing image:', error);
    }
  };

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
    //console.log(box);
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    if (this.state.file) {
      // Handle file upload
      this.setState({ imageUrl: this.state.file });
      fetch('https://agile-brushlands-08884-f69c8fdf1fe8.herokuapp.com/imageurl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file: this.state.file,  // Send the base64 file to backend
        }),
      })
        .then(response => response.json())
        .then(result => {
          if (result) {
            this.displayFaceBox(this.calculateBoxLocation(result));
            this.setState(prevState => {
              const newCount = prevState.submissionCount + 1;
              sessionStorage.setItem('submissionCount', newCount);
              return { submissionCount: newCount };
            });
          }
        })
        .catch(err => console.log('Error:', err));
    } else if (this.state.input) {
      // Handle image URL submission (as it already works)
      this.setState({ imageUrl: this.state.input });
      fetch('https://agile-brushlands-08884-f69c8fdf1fe8.herokuapp.com/imageurl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: this.state.input }),
      })
        .then(response => response.json())
        .then(result => {
          if (result) {
            this.displayFaceBox(this.calculateBoxLocation(result));
            this.setState(prevState => {
              const newCount = prevState.submissionCount + 1;
              sessionStorage.setItem('submissionCount', newCount);
              return { submissionCount: newCount };
            });
          }
        })
        .catch(err => console.log('Error:', err));
    }
  };

  render() {
    const { input, imageUrl, boxes } = this.state;
    return (
      <div className="App">
        <ParticlesBg color="#d6d6d6" type="cobweb" bg={true} /> 
        <Logo />
        <ImageLinkForm 
          onInputChange={ this.onInputChange }
          onFileChange={this.onFileChange} 
          onButtonSubmit={ this.onButtonSubmit } />
        <h1>Submission Count: {this.state.submissionCount}</h1>
        <FacialRecognition boxes={ boxes } imageUrl={ imageUrl }/>
      </div>
    );

  }
}

export default App;
import React, { Component } from 'react';
import Pica from 'pica';
import ParticlesBg from 'particles-bg';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FacialRecognition from './components/FacialRecognition/FacialRecognition';
import './App.css';

const pica = Pica();

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

  onFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const resizedImage = await this.resizeImage(file, 800, 800);  // Resize to 800x800
      this.setState({ file: resizedImage, input: file.name });  // Store resized image as file
    }
  };

  resizeImage = (file, maxWidth, maxHeight) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;
      };

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Resize the image using Pica
        pica.resize(img, canvas)
          .then(() => {
            pica.toBlob(canvas, 'image/jpeg', 0.8)  // Compress the image
              .then((blob) => {
                const resizedFile = new File([blob], file.name, {
                  type: file.type,
                  lastModified: Date.now(),
                });
                resolve(resizedFile);  // Resolve the resized image
              });
          })
          .catch((error) => {
            reject(error);
          });
      };

      reader.readAsDataURL(file);  // Read the original file
    });
  };


  onButtonSubmit = () => {
    const { input, file } = this.state;
    
    if (file) {
      // Convert the file to base64 when "Detect" is clicked
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64File = reader.result.split(',')[1];

        // Set the imageUrl for display and make API call with base64 file
        this.setState({ imageUrl: reader.result });
        
        fetch('https://agile-brushlands-08884-f69c8fdf1fe8.herokuapp.com/imageurl', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file: base64File })  // Send the base64 file to the backend
        })
        .then(response => response.json())
        .then(result => {
          if (result) {
            this.displayFaceBox(this.calculateBoxLocation(result));  // Show face bounding boxes
          }
        })
        .catch(err => console.log('Error:', err));
      };

      reader.readAsDataURL(file);  // Convert file to base64
    } else if (input) {
      // For URL submission
      this.setState({ imageUrl: input });

      fetch('https://agile-brushlands-08884-f69c8fdf1fe8.herokuapp.com/imageurl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input })  // Send the image URL to the backend
      })
      .then(response => response.json())
      .then(result => {
        if (result) {
          this.displayFaceBox(this.calculateBoxLocation(result));  // Show face bounding boxes
        }
      })
      .catch(err => console.log('Error:', err));
    }
  };

  render() {
    return (
      <div className="App">
        <ParticlesBg color="#d6d6d6" type="cobweb" bg={true} /> 
        <Logo />
        <ImageLinkForm 
          inputValue={this.state.input}
          onInputChange={ this.onInputChange } 
          onButtonSubmit={ this.onButtonSubmit }
          onFileUpload={this.onFileUpload} />
        <h1>Submission Count: {this.state.submissionCount}</h1>
        <FacialRecognition boxes={ this.state.boxes } imageUrl={ this.state.imageUrl }/>
      </div>
    );

  }
}

export default App;
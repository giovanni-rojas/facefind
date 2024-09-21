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
  submissionCount: sessionStorage.getItem('submissionCount') ? parseInt(sessionStorage.getItem('submissionCount')) : 0,
  errorMessage: '',
  fileName: '',

}

class App extends Component {
  constructor() {
    super();
    this.state = {
      ...initialState
    };
  }

  onFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validExtensions = /\.(jpg|jpeg|png|gif|bmp|webp|tiff)(\?.*)?$/i; 
      if (!validExtensions.test(file.name)) {
        this.setState({ errorMessage: 'Please upload a valid image (.jpg, .png, etc.)', file: null, fileName: '' });
        return; // Prevent further processing
      }
  
      const reader = new FileReader();
      reader.onloadend = () => {
        this.setState({ 
          file: reader.result, 
          errorMessage: '', 
          fileName: file.name, // This is for potential use later
          input: file.name // Set the input to the file name
        });
      };
      reader.readAsDataURL(file); // Convert the file to base64
    }
  };

  validateImage = (url) => {
    const validExtensions = /\.(jpg|jpeg|png|gif|bmp|webp|tiff)(\?.*)?$/i; 
    return (url.startsWith('http') || url.startsWith('https')) && validExtensions.test(url);
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
    this.setState({input: event.target.value });
  }

  onButtonSubmit = () => {

    const { file, input } = this.state;

    if (file) {
      fetch('https://agile-brushlands-08884-f69c8fdf1fe8.herokuapp.com/imageurl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file: file,  // Send the base64 file to backend
        }),
      })
        .then(response => response.json())
        .then(result => {
          if (result) {
            this.displayFaceBox(this.calculateBoxLocation(result));
            this.setState(prevState => {
              const newCount = prevState.submissionCount + 1;
              sessionStorage.setItem('submissionCount', newCount);
              return { submissionCount: newCount,  errorMessage: '', input: '', file: null, fileName: '', imageUrl: file };
            });
          }
        })
        .catch(err => {
          console.log('Error uploading file:', err);
          this.setState({ errorMessage: 'Please enter a valid image (.jpg, .png, etc.)', input: '' });
        });
    } else if (input) {
      const validExtensions = /\.(jpg|jpeg|png|gif|bmp|webp|tiff)(\?.*)?$/i; 
      const isValidImageUrl = validExtensions.test(input);
  
      if (!isValidImageUrl) {
        // If the URL doesn't have a standard image extension, use the blob approach
        fetch(input)
          .then(response => {
            if (!response.ok) {
              throw new Error('Image not accessible');
            }
            const contentType = response.headers.get('Content-Type');
            // Check if the response is an image
            if (!contentType || !contentType.startsWith('image/')) {
              throw new Error('Not an image URL');
            }
            return response.blob(); // Get the image as a blob
          })
          .then(blob => {
            // Create a local URL for the image blob
            const url = URL.createObjectURL(blob);
            this.setState({ imageUrl: url }); // Set the image URL
  
            // Now proceed to send the input to your API
            return fetch('https://agile-brushlands-08884-f69c8fdf1fe8.herokuapp.com/imageurl', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ input: input }), // Send the input directly
            });
          })
          .then(response => response.json())
          .then(result => {
            if (result) {
              this.displayFaceBox(this.calculateBoxLocation(result));
              this.setState(prevState => {
                const newCount = prevState.submissionCount + 1;
                sessionStorage.setItem('submissionCount', newCount);
                return { submissionCount: newCount, errorMessage: '', input: '', file: null, fileName: '' };
              });
            }
          })
          .catch(err => {
            console.log('Error:', err);
            this.setState({ errorMessage: 'Please enter a valid image URL.', input: '' });
          });
      } else {
        // Proceed with the standard image URL processing
        this.setState({ imageUrl: input });
        fetch('https://agile-brushlands-08884-f69c8fdf1fe8.herokuapp.com/imageurl', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: input }),
        })
          .then(response => response.json())
          .then(result => {
            if (result) {
              this.displayFaceBox(this.calculateBoxLocation(result));
              this.setState(prevState => {
                const newCount = prevState.submissionCount + 1;
                sessionStorage.setItem('submissionCount', newCount);
                return { submissionCount: newCount, errorMessage: '', input: '', file: null, fileName: '' };
              });
            }
          })
          .catch(err => {
            console.log('Error:', err);
            this.setState({ errorMessage: 'Please enter a valid image (.jpg, .png, etc.)', input: '' });
          });
      }
    }
  };

  render() {
    const { input, imageUrl, boxes, fileName, errorMessage } = this.state;
    return (
      <div className="App">
        <ParticlesBg color="#d6d6d6" type="cobweb" bg={true} /> 
        <Logo />
        <ImageLinkForm 
          onInputChange={ this.onInputChange }
          onFileChange={this.onFileChange} 
          onButtonSubmit={ this.onButtonSubmit }
          inputValue={input}
        />
        {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        <h1>Submission Count: {this.state.submissionCount}</h1>
        <FacialRecognition boxes={ boxes } imageUrl={ imageUrl }/>
      </div>
    );

  }
}

export default App;
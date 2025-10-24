import React, { Component } from 'react';
import DOMPurify from 'dompurify';
import ParticlesBg from 'particles-bg';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FacialRecognition from './components/FacialRecognition/FacialRecognition';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL

const initialState = {
  input: '',
  imageUrl: '',
  boxes: [],
  file: null,
  facesDetected: 0,
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

  componentDidMount() {
    // Simple health check
    fetch(`${API_URL}/`)
      .then(response => {
        //console.log('Backend health check status:', response.status);
        return response.text();
      })
      .then(data => console.log('Backend response:', data))
      .catch(err => console.error('Backend health check failed:', err));
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
  }

  onInputChange = (event) => {
    const sanitizedInput = DOMPurify.sanitize(event.target.value);
    this.setState({input: sanitizedInput });
  }

  onButtonSubmit = () => {
    const { file, input } = this.state;
    //console.log('Starting onButtonSubmit with:', { hasFile: !!file, hasInput: !!input });

    if (file) {
      //console.log('Processing file upload');
      fetch(`${API_URL}/imageurl`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file: file,
        }),
      })
        .then(response => {
          //console.log('File upload response status:', response.status);
          if (!response.ok) {
            return response.text().then(text => {
              console.error('Server response:', text);
              throw new Error(`HTTP error! status: ${response.status}`);
            });
          }
          return response.json();
        })
        .then(result => {
          //console.log('Received result:', result);
          if (result) {
            this.setState({ imageUrl: file }, () => {
              const image = document.getElementById('inputImage');
              image.onload = () => {
                const faceCount = result.length;
                this.displayFaceBox(this.calculateBoxLocation(result));
                this.setState(prevState => {
                  const newCount = prevState.facesDetected + faceCount;
                  sessionStorage.setItem('facesDetected', faceCount);
                  return { facesDetected: faceCount,  errorMessage: '', input: '', file: null, fileName: ''};
                });
              };
            });
          }
        })
        .catch(err => {
          console.error('Detailed error in file upload:', err);
          this.setState({ errorMessage: 'Please enter a valid image (.jpg, .png, etc.)', input: '' });
          this.setState({ 
            errorMessage: `Error processing image: ${err.message}`, 
            input: '' 
          });
        });
    } else if (input) {
      //console.log('Processing URL input:', input);
      const validExtensions = /\.(jpg|jpeg|png|gif|bmp|webp|tiff)(\?.*)?$/i; 
      const isValidImageUrl = validExtensions.test(input);
  
      if (!isValidImageUrl) {
        fetch(input)
          .then(response => {
            //console.log('URL image response status:', response.status);
            if (!response.ok) {
              throw new Error('Image not accessible');
            }
            const contentType = response.headers.get('Content-Type');
            if (!contentType || !contentType.startsWith('image/')) {
              throw new Error('Not an image URL');
            }
            return response.blob();
          })
          .then(blob => {
            const url = URL.createObjectURL(blob);
            this.setState({ imageUrl: url }, () => { // Set the image URL
              const image = document.getElementById('inputImage');
              image.onload = () => {
                fetch(`${API_URL}/imageurl`, {
                  method: 'POST',
                  headers: { 
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ 
                    input: input 
                  }),
                })
                .then(response => {
                  if (!response.ok) {
                    return response.text().then(text => {
                      console.error('Server response:', text);
                      throw new Error(`HTTP error! status: ${response.status}`);
                    });
                  }
                  return response.json();
                })
                .then(result => {
                  if (result) {
                    const faceCount = result.length;
                    this.displayFaceBox(this.calculateBoxLocation(result));
                    this.setState(prevState => {
                      const newCount = prevState.facesDetected + faceCount;
                      sessionStorage.setItem('facesDetected', faceCount);
                      return { facesDetected: faceCount, errorMessage: '', input: '', file: null, fileName: '' };
                    });
                  }
                })
                .catch(err => {
                  this.setState({ errorMessage: 'Please enter a valid image URL.', input: '' });
                  console.error('Detailed error:', err);
                  this.setState({ 
                    errorMessage: `Error processing image: ${err.message}`, 
                    input: '' 
                  });
                });
              };
            });
        })
        .catch(err => {
          //console.log('Error:', err);
          console.error('Detailed error:', err);
          this.setState({ errorMessage: 'Please enter a valid image URL.', input: '' });
        });
      } 
      else {
      // Proceed with the standard image URL processing
        this.setState({ imageUrl: input }, () => {
          const image = document.getElementById('inputImage');
          image.onload = () => {
            fetch(`${API_URL}/imageurl`, {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                input: input 
              }),
            })
            .then(response => {
              //console.log('Regular image response status:', response.status);
              if (!response.ok) {
                return response.text().then(text => {
                  console.error('Server response:', text);
                  throw new Error(`HTTP error! status: ${response.status}`);
                });
              }
              return response.json();
            })
            .then(result => {
              if (result) {
                const faceCount = result.length;
                this.displayFaceBox(this.calculateBoxLocation(result));
                this.setState(prevState => {
                  const newCount = prevState.facesDetected + faceCount;
                  sessionStorage.setItem('facesDetected', faceCount);
                  return { facesDetected: faceCount, errorMessage: '', input: '', file: null, fileName: '' };
                });
              }
            })
            .catch(err => {
              this.setState({ errorMessage: 'Please enter a valid image URL.', input: '' });
              console.error('Detailed error in regular image URL processing:', err);
              this.setState({ 
                errorMessage: `Error processing image: ${err.message}`, 
                input: '' 
              });
            });
          };
        });
      }
  }
};

  render() {
    const { input, imageUrl, boxes, facesDetected, errorMessage } = this.state;
    return (
      <div className="App">
        <ParticlesBg color="#d6d6d6" type="cobweb" bg={true} /> 
        <Logo />
        <ImageLinkForm 
          onInputChange={this.onInputChange}
          onFileChange={this.onFileChange} 
          onButtonSubmit={this.onButtonSubmit}
          inputValue={input}
        />
        {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        <h1>Faces Detected: {facesDetected}</h1>
        <FacialRecognition boxes={ boxes } imageUrl={ imageUrl }/>
      </div>
    );

  }
}

export default App;
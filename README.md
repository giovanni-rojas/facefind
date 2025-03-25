# facefind
![Facefind Demo](public/facefindDemo.gif)

## Overview
[Facefind](https://face-find-d1246eeab4c8.herokuapp.com/) is a React app that detects and counts faces in images using [Clarifai's Face Detection Model](https://clarifai.com/clarifai/main/models/face-detection) API.

## How It Works
Users can upload an image directly from their device or enter a link to an image found online. The image is sent to a backend Heroku server, which works with the Clarifai API to analyze the image and detect faces. The app displays the original image with boxes drawn around each detected face, along with the total number of faces identified in the picture.

### Key Features
- **User-Friendly Interface**: Simple input fields for uploading images from your device or entering image URLs.
- **Face Detection**: Leverages Clarifai's Face Detection Model to accurately identify faces in images.
- **Live Results**: Displays the number of detected faces in the submitted image.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Usage

To run this project locally, you will need Node.js installed.

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/facefind.git
   cd SpeedTester
   ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start development server:
    ```bash
    npm start
    ```
4. Build for production:
    ```bash
    npm run build
    ```

### Backend Requirements
This project implements the app's frontend. For the app to function properly, it needs to connect to a suitable backend server to manage the full data flow for sending requests to Clarifai. See [https://github.com/giovanni-rojas/facefind-api](https://github.com/giovanni-rojas/facefind-api).

## Contributing
Contributions are welcome! Here's how you can contribute:

1. **Fork the repository**: Click the "Fork" button on the top right of the GitHub page to create your own copy.
2. **Clone the forked repository** to your local machine:
   ```bash
   git clone https://github.com/your-username/facefind.git
    ```
3. **Create a new branch** for your feature or bug fix:
    ```bash
    git checkout -b feature-name
    ```
4. **Make your changes** and commit them:
    ```bash
    git commit -m "Add feature name or fix description"
    ```
5. **Push your changes** to your fork:
    ```bash
    git push origin feature-name
    ```
6. **Create a pull request:** Once your changes are pushed, go to the original repository and create a pull request to merge your changes into the main project.

Please open an issue or start a discussion before submitting large changes. Contributions that improve the app or address existing issues are appreciated!

## History
- **Version 1.0.0**: Initial release. Support for nearly all valid image formats (.png, .jpg, etc.).

## Credits
- **Clarifai**: Uses [Clarifai's Face Detection Model](https://clarifai.com/clarifai/main/models/face-detection) API, using machine learning to identify and analyze faces in images. Visit [Clarifai](https://clarifai.com) for more information on all of their services.
- **[Andrei Neagoi](https://github.com/aneagoie)**: This app is the final project for Andrei Neagoi's [ZTM: The Complete Web Developer](https://zerotomastery.io/courses/coding-bootcamp/) course. 

## License
Facefind is released under the [MIT License](https://opensource.org/license/MIT).
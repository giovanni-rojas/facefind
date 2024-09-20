import React, { useRef } from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ( { onInputChange, onButtonSubmit, onFileChange, inputValue } ) => {

	const buttonRef = useRef(null);

	const handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			onButtonSubmit();
		}
	}

	const handleButtonClick = () => {
		// Scale the button up
		buttonRef.current.classList.add('button-active');
	
		// Trigger the submit action
		onButtonSubmit();
	
		// Reset the scale after a short delay
		setTimeout(() => {
		  buttonRef.current.classList.remove('button-active');
		}, 200); // Match this with the duration in CSS
	  };
	
	return (
		<div>
		  <p className='f3'>
			{'This app will detect faces in your picture. Give it a try!'}
		  </p>
		  <div className='center'>
			<div className='form center pa4 br3 shadow-5' style={{ display: "flex", alignItems: 'center', width: '100%' }}>
			  <input
				className='f4 pa2 w-70 center' 
				type='file'
				id='fileInput'
				onChange={onFileChange}
				style={{ display: 'none' }}
			  />
			<label htmlFor='fileInput' className='grow'>
            	Browse
          	</label>
			  <input
				className='f4 pa2 w-20 center ml2' // Adjust width and margin
				type='text'
				placeholder='Enter image URL or upload image'
				onChange={onInputChange}
				onKeyPress={handleKeyPress}
				value={inputValue}
			  />
			  <button 
			  	ref={buttonRef}
				className={'w-20 grow f4 link ph3 pv2 dib white bg-light-purple'} 
				onClick={handleButtonClick}
			  >
				Detect
			  </button>
			</div>
		  </div>
		</div>
	  );
}

export default ImageLinkForm;
import React, { useState } from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ( { onInputChange, onButtonSubmit, onFileChange, inputValue } ) => {

	const handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			onButtonSubmit();
		}
	}


	return (
		<div>
		  <p className='f3'>
			{'This App will detect faces in your picture. Give it a try!'}
		  </p>
		  <div className='center'>
			<div className='form center pa4 br3 shadow-5'>
			  <input
				className='f4 pa2 w-70 center' 
				type='file'
				id='fileInput'
				onChange={onFileChange}
				style={{ display: 'none' }}
			  />
			<label htmlFor='fileInput' className='f4 pa2 w-20 center bg-light-purple white dib grow pointer'>
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
				className='w-20 grow f4 link ph3 pv2 dib white bg-light-purple'
				onClick={onButtonSubmit}
			  >
				Detect
			  </button>
			</div>
		  </div>
		</div>
	  );
}

export default ImageLinkForm;
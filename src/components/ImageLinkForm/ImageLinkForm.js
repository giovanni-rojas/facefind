import React, { useState } from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ( { onInputChange, onButtonSubmit, onFileChange } ) => {

	const handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			onButtonSubmit();
		}
	}

	return(
		<div>
			<p className='f3'>
				{'This App will detect faces in your picture. Give it a try!'}
			</p>
			<div className='center'>
        <div className='form center pa4 br3 shadow-5'>
          <input 
            className='f4 pa2 w-70 center' 
            type='text' 
            placeholder='Enter Image URL' 
            onChange={onInputChange} 
            onKeyPress={handleKeyPress} 
          />
          <input 
            className='f4 pa2 w-70 center mt2' 
            type='file' 
            onChange={onFileChange} // Handle file upload
          />
          <button 
            className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple'
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
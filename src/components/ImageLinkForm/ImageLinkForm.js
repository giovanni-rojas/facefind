import React, { useState } from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ( { onInputChange, onButtonSubmit, onFileUpload } ) => {

	const handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			onButtonSubmit();
		}
	}

	return(
		<div>
			<p className='f3'>
				{'Enter an image URL (.png, .jpg, etc.), or upload an image to try it out!'}
			</p>
			<div className='center'>
				<div className='form center pa4 br3 shadow-5'>
					<input className='f4 pa2 w-70 center' type='text' placeholder='Enter image URL' onChange={ onInputChange } onKeyPress={handleKeyPress}/>
					<button 
						className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple'
						onClick = { onButtonSubmit }
					>Detect</button>
				</div>
				<div className='form center pa4 br3 shadow-5 mt2'>
					<input
						className='f4 pa2 w-70 center'
						type='file'
						accept='image/*'
						onChange={onFileUpload}
					/>
				</div>
			</div>
		</div>
	);
}

export default ImageLinkForm;
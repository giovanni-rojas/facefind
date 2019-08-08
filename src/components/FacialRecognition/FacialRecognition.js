import React from 'react';

const FacialRecognition = ({ imageUrl }) => {
	return(
		<div className='center'>
			<img alt='' src={ imageUrl } />
		</div>
	);
}

export default FacialRecognition;
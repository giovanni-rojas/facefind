import React from 'react';
import DOMPurify from 'dompurify';
import './FacialRecognition.css';

const FacialRecognition = ({ imageUrl, boxes }) => {
	const sanitizedImageUrl = DOMPurify.sanitize(imageUrl);
	return (
	  <div className='center ma'>
		<div className='absolute mt2'>
		  <img id='inputImage' alt='' src={ sanitizedImageUrl } width='500px' height='auto' />
		  {boxes.map((box, index) => (
			<div
			  key={index}
			  className='bounding-box'
			  style={{
				top: box.topRow,
				right: box.rightCol,
				bottom: box.bottomRow,
				left: box.leftCol
			  }}
			/>
		  ))}
		</div>
	  </div>
	);
  };

export default FacialRecognition;
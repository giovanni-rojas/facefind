import React from 'react';
import './FacialRecognition.css';

const FacialRecognition = ({ imageUrl, boxes }) => {
	return(
		// <div className='center ma'>
		// 	<div className='absolute mt2'>	
		// 		<img id='inputImage' alt='' src={ imageUrl } width='500px' height='auto'/>
		// 		<div className='bounding-box' style={{ top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol }}></div>
		// 	</div>
		// </div>
		<div className='center ma'>
			<div className='absolute mt2'>
				<img id='inputImage' alt='' src = {imageUrl} width='500px' height='auto'/>
				{boxes.map(box =>
					<div key={`box${box.topRow}${box.righCol}`}
						className='bounding-box'
						style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}>
					</div>
				)}
			</div>
		</div>
	);
}

export default FacialRecognition;
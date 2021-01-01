import React from 'react';
import './FaceRecognition.css';

// Pure function
// We can destructure onInputChange and onButtonSubmit from the props with {}
// instead of saying props.onInputChange and props.onButtonSubmit.
// These two act like callbacks seen on Flutter app.
const FaceRecognition = ({faceBox, imageUrl}) => {
  return (
    <div className='center ma'>
      <div className='absolute mt2'>
        <img id='inputImage' src={imageUrl} alt='' width='500px' height='auto' />
        <div className='bounding-box' style={{top: faceBox.topRow, right: faceBox.rightCol,bottom: faceBox.bottomRow,left: faceBox.leftCol}}></div>
      </div>
    </div>
  );
}

export default FaceRecognition;

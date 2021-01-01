import React from 'react';

// Pure function
const Navigation = ({onRouteChange, isSignedIn}) => {
    if (isSignedIn) {
      return(
        // Set style attributes by passing an object
        <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
          {/* Use tachyons to style the paragraph */}
          <p 
            onClick={() => onRouteChange('signin')}
            className='f3 link dim black underline pa3 pointer'>Sign Out
          </p>
        </nav>
      );
    } else {
      return (
        <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
          <p onClick={() => onRouteChange('signin')} className='f3 link dim black underline pa3 pointer'>Sign In</p>
          <p onClick={() => onRouteChange('register')} className='f3 link dim black underline pa3 pointer'>Register</p>
        </nav>
      );
    }
}

export default Navigation;

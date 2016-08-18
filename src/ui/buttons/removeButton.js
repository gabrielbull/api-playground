import React, { Component, PropTypes } from 'react';

const styles = {
  button: {
    color: '#ff3900',
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  }
};

class RemoveButton extends Component {
  render() {
    const { children, style, ...props } = this.props;

    return (
      <a style={{ ...styles.button, ...style }} {...props}>
        {children}
        <svg x="0px" y="0px" width="10px" height="10px" viewBox="0 0 10 10" style={{ marginLeft: '4px' }}>
          <path
            fill="#ff3900"
            d="M6.8,5l3.1-3.1c0.2-0.2,0.2-0.5,0-0.7L8.8,0.1C8.6,0,8.3,0,8.1,0.1
                  L5,3.2L1.9,0.1C1.7,0,1.4,0,1.2,0.1L0.1,1.2C0,1.4,0,1.7,0.1,1.9L3.2,5L0.1,8.1C0,8.3,0,8.6,0.1,8.8l1.1,1.1c0.2,0.2,0.5,0.2,0.7,0
                  L5,6.8l3.1,3.1c0.2,0.2,0.5,0.2,0.7,0l1.1-1.1c0.2-0.2,0.2-0.5,0-0.7L6.8,5z"
          />
        </svg>
      </a>
    );
  }
}

export default RemoveButton;

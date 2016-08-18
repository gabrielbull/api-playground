import React, { Component, PropTypes } from 'react';

const styles = {
  button: {
    background: 'linear-gradient(to bottom, #bcbcbc 0%, #9a9a9a 100%)',
    border: '1px solid #333333',
    borderRadius: '3px',
    padding: '3px 6px',
    color: '#333333',
    fontSize: '11px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  }
};

class Button extends Component {
  render() {
    const { children, style, ...props } = this.props;

    return (
      <a style={{ ...styles.button, ...style }} {...props}>
        {children}
      </a>
    );
  }
}

export default Button;

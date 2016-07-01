import React, { Component, PropTypes } from 'react';

const style = {
  lineHeight: '22px',
  marginRight: '10px',
  color: '#999',
  fontSize: '11px',
  textTransform: 'uppercase'
};

class Label extends Component {
  render() {
    return (
      <div style={style}>
        {this.props.children}
      </div>
    );
  }
}

export default Label;

import React, { Component, PropTypes } from 'react';

const style = {
  position: 'relative',
  listStyle: 'none',
  margin: '0px 0px -1px 0px',
  borderTop: '1px solid #333',
  borderLeft: '1px solid #333',
  borderRight: '1px solid #333',
  borderTopRightRadius: '2px',
  borderTopLeftRadius: '2px',
  padding: '10px 20px',
  cursor: 'pointer'
};

const marker = {
  position: 'absolute',
  left: '7px',
  top: '14px',
  height: '7px',
  width: '7px',
  background: 'rgb(168, 255, 0)',
  borderRadius: '50%'
};

class Tab extends Component {
  static propTypes = {
    index: PropTypes.number,
    onClick: PropTypes.func
  };

  render() {
    const componentStyle = { ...style };

    if (this.props.index > 0) {
      componentStyle.borderLeft = 'none'
    }

    if (this.props.selected) {
      componentStyle.boxShadow = 'inset 0px 2px 0px rgb(0, 180, 255)';
      componentStyle.background = 'rgb(20, 21, 23)';
    }

    let markUpdated;
    if (this.props.markUpdated) {
      markUpdated = <div style={marker}/>;
    }

    return (
      <li style={componentStyle} onClick={this.props.onClick}>
        {this.props.children}
        {markUpdated}
      </li>
    );
  }
}

export default Tab;

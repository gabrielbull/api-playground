import React, { Component, PropTypes, Children, cloneElement } from 'react';

export Tab from './tab';

const style = {
  listStyle: 'none',
  padding: '0px',
  margin: '0px',
  display: 'flex',
  borderBottom: '1px solid #333'
};

class Tabs extends Component {
  render() {
    return (
      <ul style={style}>
        {Children.map(this.props.children, (child, index) => cloneElement(child, { index }))}
      </ul>
    );
  }
}

export default Tabs;

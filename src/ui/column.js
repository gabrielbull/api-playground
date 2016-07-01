import React, { Component } from 'react';

class Column extends Component {
  render() {
    const { children, ...props } = this.props;
    return (
      <td {...props}>
        {children}
      </td>
    );
  }
}

export default Column;

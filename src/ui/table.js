import React, { Component, PropTypes } from 'react';

export Row from './row';
export Column from './column';

const styles = {
  table: {
    marginTop: '20px',
    width: '100%'
  },
  th: {
    padding: '4px 10px',
    background: 'rgba(255, 255, 255, .2)',
    color: 'black'
  }
};

class Table extends Component {
  static propTypes = {
    headers: PropTypes.array.isRequired
  };

  render() {
    return (
      <table style={styles.table}>
        {this.renderHeaders()}
        <tbody>
        {this.props.children}
        </tbody>
      </table>
    );
  }

  renderHeaders() {
    return (
      <thead>
      <tr>
      {this.props.headers.map(header => (
        <th key={header} style={styles.th}>
          {header}
        </th>
      ))}
      </tr>
      </thead>
    );
  }
}

export default Table;

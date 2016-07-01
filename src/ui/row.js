import React, { Component, PropTypes } from 'react';

const styles = {
  td: {
    padding: '4px 10px',
    background: 'rgba(255, 255, 255, .1)',
    color: '#eee'
  }
};

class Row extends Component {
  static propTypes = {
    color: PropTypes.string
  };

  render() {
    return (
      <tr>
        {this.props.children}
      </tr>
    );
  }

  renderData() {
    let finalData = [];
    if (Object.prototype.toString.call(this.props.data) !== '[object Array]') {
      for (let prop in this.props.data) {
        if (this.props.data.hasOwnProperty(prop)) {
          finalData.push(this.props.data[prop]);
        }
      }
    } else {
      finalData = this.props.data;
    }

    const tdStyle = { ...styles.td };
    if (this.props.color) {
      tdStyle['color'] = this.props.color;
    }

    return finalData.map((data, index) => {
      if (typeof data === 'object') data = JSON.stringify(data);
      return <td key={index} style={tdStyle}>{data}</td>;
    });
  }
}

export default Row;

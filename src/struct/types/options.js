import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

const styles = {
  container: {
    marginRight: '12px',
    fontSize: '11px',
    border: '1px solid gray',
    borderRadius: '3px',
    background: 'rgba(255, 255, 255, .1)',
    padding: '1px 6px',
    color: '#00b4ff',
    cursor: 'default',
    position: 'relative'
  },
  select: {
    outline: 'none',
    fontSize: '11px',
    border: 'none',
    borderRadius: '0px',
    WebkitAppearance: 'none',
    background: 'transparent',
    color: 'white',
    position: 'absolute',
    top: '0px',
    left: '0px',
    height: '100%',
    paddingRight: '8px'
  }
};

class Options extends Component {
  static propTypes = {
    name: PropTypes.string,
    onChange: PropTypes.func,
    options: PropTypes.func,
    data: PropTypes.string,
  };

  componentDidMount() {
    const container = ReactDOM.findDOMNode(this);
    const containerRect = container.getBoundingClientRect();
    const select = container.getElementsByTagName('select')[0];
    const selectRect = select.getBoundingClientRect();
    select.style.paddingLeft = (containerRect.width - 9) + 'px';
    container.style.width = (containerRect.width + selectRect.width - 22) + 'px';
  }

  handleChange = e => {
    this.props.onChange(e.target.value);
  };

  render() {
    const { style, name, ...props } = this.props;
    delete props.onChange;
    delete props.options;
    delete props.data;

    return (
      <div style={{ ...styles.container, ...style }} {...props}>
        <span style={{ color: 'gray', marginRight: '6px' }}>
          {name}:
        </span>
        <select onChange={this.handleChange} style={styles.select} defaultValue={this.props.data}>
          {this.renderOptions()}
        </select>
      </div>
    );
  }

  renderOptions() {
    return this.props.options().map(option => (
      <option key={option}>{option}</option>
    ));
  }
}

export default Options;

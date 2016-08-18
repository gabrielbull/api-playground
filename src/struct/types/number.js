import React, { Component, PropTypes } from 'react';
import Field from '../../ui/field';

class Number extends Component {
  static propTypes = {
    data: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func
  };

  handleChange = data => {
    data = data !== null ? data.replace(/[^0-9\.\,]/g, '') : null;
    this.props.onChange(data !== '' ? data : null);
  };

  render() {
    const { data, name, ...props } = this.props;
    delete props.onChange;

    return (
      <div {...props}>
        <Field onChange={this.handleChange} name={name} value={data} style={{ marginBottom: '0px' }}/>
      </div>
    );
  }
}

export default Number;

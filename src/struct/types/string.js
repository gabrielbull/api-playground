import React, { Component, PropTypes } from 'react';
import Field from '../../ui/field';

class String extends Component {
  static propTypes = {
    data: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func
  };

  render() {
    const { data, name, onChange, ...props } = this.props;

    return (
      <div {...props}>
        <Field onChange={onChange} name={name} value={data} style={{ marginBottom: '0px' }}/>
      </div>
    );
  }
}

export default String;

import React, { Component, PropTypes } from 'react';
import ArrayComponent from './array';
import String from './string';
import Image from './image';
import Options from './options';
import Number from './number';

const styles = {
  row: {
    flex: 1,
    borderLeft: '2px solid rgb(0, 180, 255)',
    paddingLeft: '8px',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px'
  }
};

class Struct extends Component {
  static propTypes = {
    struct: PropTypes.object,
    data: PropTypes.object,
    onChange: PropTypes.func
  };

  handleChange = (prop, value) => {
    const nextData = {};
    nextData[prop] = value;
    this.props.onChange({ ...this.props.data, ...nextData  });
  };

  render() {
    const { ...props } = this.props;
    delete props.struct;
    delete props.data;
    delete props.onChange;

    return (
      <div {...props}>
        {this.renderItems()}
      </div>
    );
  }

  renderItems() {
    let children = [];
    let firstRowGroup = [];
    for (let prop in this.props.struct) {
      if (this.props.struct.hasOwnProperty(prop)) {
        if (Object.prototype.toString.call(this.props.struct[prop]) === '[object Array]') {
          children.push(this.renderArray(prop, this.props.struct[prop], this.props.data ? this.props.data[prop] : []));
        } else if (typeof this.props.struct[prop] === 'string') {
          firstRowGroup.push(this.renderOtherType(prop, this.props.struct[prop], this.props.data ? this.props.data[prop] : null));
        } else if (typeof this.props.struct[prop] === 'function') {
          firstRowGroup.push(this.renderOptions(prop, this.props.struct[prop], this.props.data ? this.props.data[prop] : null));
        } else {
          console.warn(this.props.struct[prop]);
        }
      }
    }
    if (firstRowGroup.length) {
      children = [
        <div key="firstRowGroup" style={styles.row}>{firstRowGroup}</div>,
        ...children,
      ];
    }

    return children;
  }

  renderArray(key, array, data) {
    return (
      <ArrayComponent
        key={key}
        name={key}
        onChange={v => this.handleChange(key, v)}
        struct={array[0]}
        data={data ? data : []}
      />
    );
  }

  renderOptions(key, options, data) {
    return (
      <Options
        key={key}
        name={key}
        onChange={v => this.handleChange(key, v)}
        options={options}
        data={data}
      />
    );
  }

  renderOtherType(key, type, data) {
    const props = { key, name: key, data };
    switch (type) {
    case 'string':
      return <String onChange={v => this.handleChange(key, v)} {...props}/>;
    case 'base64image':
      return <Image onChange={v => this.handleChange(key, v)} {...props}/>;
    case 'number':
      return <Number onChange={v => this.handleChange(key, v)} {...props}/>;
    default:
      console.warn(type);
    }
  }
}

export default Struct;

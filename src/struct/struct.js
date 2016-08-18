import React, { Component, PropTypes } from 'react';
import Struct from './types/struct';

const styles = {
  container: {
    flex: 1,
  }
};

let id = 0;

class StructComponent extends Component {
  static propTypes = {
    struct: PropTypes.object,
    persistKey: PropTypes.string
  };

  id;

  constructor(props, context, updater) {
    super(props, context, updater);
    this.id = id = id + 1;
    this.persistKey = (props.persistKey ? props.persistKey : 'api-playground.' + context.playgroundComponent) + '.struct.' + this.id;
    this.state = {
      data: {}
    };
    if (localStorage[this.persistKey + '.data']) {
      try {
        this.state.data = JSON.parse(localStorage[this.persistKey + '.data']);
        if (!this.state.data) this.state.data = {};
      } catch (err) {
        this.state.data = {};
      }
    }
  }

  handleChange = value => {
    this.setState({ data: value });
    localStorage[this.persistKey + '.data'] = JSON.stringify(value);
    this.props.onChange(value);
  };

  render() {
    const { struct, style, ...props } = this.props;
    delete props.persistKey;

    return (
      <div style={{ ...styles.container, ...style }} {...props}>
        <Struct struct={struct} data={this.state.data} onChange={this.handleChange}/>
      </div>
    );
  }
}

export default StructComponent;

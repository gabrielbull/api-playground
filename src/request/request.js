import React, { Component, PropTypes } from 'react';
import addXMLRequestCallback from './network';

class Request extends Component {
  static propTypes = {
    object: PropTypes.object,
    boolean: PropTypes.bool,
    number: PropTypes.number,
    action: PropTypes.func.isRequired
  };

  static defaultProps = {
  };

  constructor() {
    super();
    addXMLRequestCallback((args) => {
      if (args.responseURL.indexOf('sockjs-node') === -1) {
        console.log('heyo', args);
      }
    });
  }

  render() {
    return (
      <div onClick={() => this.props.action()}>
        hello world
      </div>
    );
  }
}

export default Request;

import React, { Component, PropTypes } from 'react';
import { addRequestListener, removeRequestListener } from './network';

class Request extends Component {
  static propTypes = {
    object: PropTypes.object,
    boolean: PropTypes.bool,
    number: PropTypes.number,
    action: PropTypes.func.isRequired
  };

  static defaultProps = {
  };

  request = () => {
    addRequestListener(this.requestCallback);
    this.props.action()
      .then(this.handleSuccess)
      .catch(this.handleError);
    removeRequestListener(this.requestCallback);
  };

  requestCallback = request => {
    console.log(request);
  };

  handleSuccess = response => {
    console.log('%cSuccess', 'color: green', response);
  };

  handleError = error => {
    console.error(error);
  };

  render() {
    return (
      <div onClick={this.request}>
        hello world
      </div>
    );
  }
}

export default Request;

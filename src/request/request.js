import React, { Component, PropTypes } from 'react';
import { addRequestListener, removeRequestListener } from './network';
import Field from '../ui/field';

const styles = {
  fields: {
    display: 'flex'
  }
};

class Request extends Component {
  static propTypes = {
    params: PropTypes.array,
    action: PropTypes.func.isRequired
  };

  static contextTypes = {
    playgroundComponent: PropTypes.number
  };

  request = () => {
    addRequestListener(this.handleRequest, this.handleSuccess, this.handleError);
    this.props.action();
  };

  handleRequest = (url, {data, method}) => {
    console.log(url, data, method);
  };

  handleSuccess = response => {
    console.log('%cSuccess', 'color: green', response);
    removeRequestListener(this.handleRequest, this.handleSuccess, this.handleError);
  };

  handleError = error => {
    console.warn(error);
    removeRequestListener(this.handleRequest, this.handleSuccess, this.handleError);
  };

  render() {
    //onClick={this.request}
    return (
      <div>
        <div style={styles.fields}>
          {this.renderParams()}
        </div>
        hello world
      </div>
    );
  }

  renderParams() {
    if (this.props.params) {
      let children = [];
      this.props.params.forEach(param => {
        children.push(<Field key={param} name={param} persistKey={this.context.playgroundComponent + '.' + param}/>);
      });
      return children;
    }
    return null;
  }
}

export default Request;

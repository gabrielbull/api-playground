import React, { Component, PropTypes } from 'react';
import JsonViewer from '../ui/jsonViewer';
import deepEqual from '../utils/deepEqual';

const styles = {
  container: {
    paddingBottom: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #222'
  }
};

class State extends Component {
  static propTypes = {
    init: PropTypes.func,
    subscribe: PropTypes.func.isRequired,
    map: PropTypes.func.isRequired
  };

  static contextTypes = {
    playground: PropTypes.object,
    name: PropTypes.string
  };

  constructor(props, context, updater) {
    super(props, context, updater);
    this.state = {
      data: null
    };
    if (props.init) {
      this.state.data = this.props.map(props.init());
    }
  }

  componentDidMount() {
    this.props.subscribe(this.handleData);
  }

  handleData = (data) => {
    this.setState({ data: this.props.map(data) });
  };

  componentDidUpdate(prevProps, prevState) {
    if (!deepEqual(prevState.data, this.state.data)) {
      this.context.playground.markUpdate(this.context.name);
    }
  }

  render() {
    return (
      <div style={styles.container}>
        <JsonViewer json={this.state.data} expanded/>
      </div>
    );
  }
}

export default State;

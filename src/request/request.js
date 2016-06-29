import React, { Component, PropTypes } from 'react';
import { addRequestListener, removeRequestListener } from './network';
import Field from '../ui/field';
import Loader from '../ui/loader';
import Table, { Row } from '../ui/table';

const styles = {
  fields: {
    display: 'flex'
  },

  run: {
    color: '#a8ff00',
    cursor: 'default'
  },

  method: {
    color: '#00b4ff',
    fontWeight: 'bold',
    marginLeft: '20px'
  },

  url: {
    fontWeight: 'normal',
    marginLeft: '8px',
    color: '#bbbbbb'
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

  params = {};

  constructor(props, context, updater) {
    super(props, context, updater);
    this.persistKey = 'api-playground.' + context.playgroundComponent + '.request';
    this.state = {
      method: localStorage[this.persistKey + '.method'],
      url: localStorage[this.persistKey + '.url'],
      showLoader: false,
      rows: []
    };
  }

  updateMethod = method => {
    localStorage[this.persistKey + '.method'] = method;
    this.setState({ method });
  };

  updateUrl = url => {
    localStorage[this.persistKey + '.url'] = url;
    this.setState({ url });
  };

  request = () => {
    this.setState({ showLoader: true });
    setTimeout(() => {
      this.startTimer();
      addRequestListener(this.handleRequest, this.handleSuccess, this.handleError);
      this.props.action(this.getData());
    }, 250);
  };

  handleRequest = (url, {data, method}) => {
    this.updateMethod(method);
    this.updateUrl(url);
    console.log(data);
    this.payload = data;
  };

  handleSuccess = response => {
    removeRequestListener(this.handleRequest, this.handleSuccess, this.handleError);
    this.setState({ showLoader: false });
    if (response && response.status) {
      console.log('%cSuccess', 'color: green', response);
    }
  };

  handleError = response => {
    removeRequestListener(this.handleRequest, this.handleSuccess, this.handleError);
    this.setState({ showLoader: false });

    if (response instanceof TypeError) {
      this.addRow({
        url: this.state.url,
        method: this.state.method,
        status: '(Failed)',
        type: '',
        time: this.stopTimer(),
        headers: {},
        payload: this.payload,
        response: response.message
      });
    } else if (response && response.status) {
      response.text().then(value => {
        this.addRow({
          url: response.url,
          method: this.state.method,
          status: response.status,
          type: response.type,
          time: this.stopTimer(),
          headers: response.headers,
          payload: this.payload,
          response: value
        });
      })
    }
  };

  startTimer = () => {
    this.timer = new Date().getTime();
  };

  stopTimer = () => {
    const time = new Date().getTime() - this.timer;
    return time + 'ms';
  };

  addRow = row => {
    this.setState({ rows: [row, ...this.state.rows] });
  };

  getData() {
    const finalData = {};
    this.props.params.forEach(param => finalData[param] = this.params[param]);
    return finalData;
  }

  render() {
    return (
      <div>
        <div style={styles.fields}>
          {this.renderParams()}
        </div>
        <a onClick={this.request} style={styles.run}>
          Run
          <svg x="0px" y="0px" width="5px" height="10px" viewBox="0 0 5 10" style={{ marginLeft: '4px' }}>
            <polygon fill="#a8ff00" points="0,0 0,10 5,5 "/>
          </svg>
        </a>
        <Loader size="12" style={{ marginLeft: '10px', opacity: this.state.showLoader ? 1 : 0 }}/>
        <span style={styles.method}>
          {this.state.method}
        </span>
        <span style={styles.url}>
          {this.state.url}
        </span>
        <div>
          <Table headers={['URL', 'Method', 'Status', 'Type', 'Time', 'Headers', 'Payload', 'Response' ]}>
            {this.renderRows()}
          </Table>
        </div>
      </div>
    );
  }

  renderParams() {
    if (this.props.params) {
      let children = [];
      this.props.params.forEach(param => {
        children.push(
          <Field
            key={param}
            onChange={value => this.params[param] = value}
            name={param}
            persistKey={this.context.playgroundComponent + '.' + param}
          />
        );
      });
      return children;
    }
    return null;
  }

  renderRows() {
    return this.state.rows.map((row, index) => {
      let color = '#eeeeee';
      if (row['status'] !== 200) color = '#ff0000';
      return <Row key={index} data={row} color={color}/>;
    });
  }
}

export default Request;

import React, { Component, PropTypes } from 'react';
import { addRequestListener, removeRequestListener } from './network';
import Field from '../ui/field';
import Loader from '../ui/loader';
import Label from '../ui/label';
import Table, { Row, Column } from '../ui/table';
import JsonViewer from '../ui/jsonViewer';

const styles = {
  container: {
    paddingBottom: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #222'
  },

  header: {
    display: 'flex'
  },

  actions: {
    marginLeft: 'auto'
  },

  name: {
    cursor: 'pointer',
    WebkitUserSelect: 'none',
    userSelect: 'none',
    display: 'inline-block',
    width: '200px'
  },

  fields: {
    display: 'flex',
    marginTop: '20px'
  },

  reset: {
    color: '#ff3900',
    cursor: 'pointer'
  },

  run: {
    color: '#a8ff00',
    marginLeft: '20px',
    cursor: 'pointer'
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

let id = 0;

class Request extends Component {
  static propTypes = {
    params: PropTypes.array,
    action: PropTypes.func.isRequired
  };

  static contextTypes = {
    playgroundComponent: PropTypes.number,
    getConfig: PropTypes.func
  };

  params = {};

  id;

  constructor(props, context, updater) {
    super(props, context, updater);
    this.id = id = id + 1;
    this.persistKey = 'api-playground.' + context.playgroundComponent + '.request.' + this.id;
    this.state = {
      method: localStorage[this.persistKey + '.method'],
      url: localStorage[this.persistKey + '.url'],
      showLoader: false,
      rows: [],
      isMinified: localStorage[this.persistKey + '.isMinified'] === true
    };
    if (localStorage[this.persistKey + '.rows']) {
      try {
        this.state.rows = JSON.parse(localStorage[this.persistKey + '.rows']);
        if (!this.state.rows) this.state.rows = [];
      } catch (err) {
        this.state.rows = [];
      }
    }
  }

  minify = () => {
    this.setState({ isMinified: true });
    localStorage[this.persistKey + '.isMinified'] = true;
  };

  maximize = () => {
    this.setState({ isMinified: false });
    localStorage[this.persistKey + '.isMinified'] = false;
  };

  updateMethod = method => {
    localStorage[this.persistKey + '.method'] = method;
    this.setState({ method });
  };

  updateUrl = url => {
    localStorage[this.persistKey + '.url'] = url;
    this.setState({ url });
  };

  reset = () => {
    this.setState({ showLoader: false, rows: [] });
    localStorage[this.persistKey + '.rows'] = JSON.stringify([]);
  };

  request = () => {
    this.setState({ showLoader: true });
    setTimeout(() => {
      this.startTimer();
      addRequestListener(this.handleRequest, this.handleSuccess, this.handleError);
      this.props.action(this.getData());
    }, 250);
  };

  handleRequest = (url, { data, method, headers }) => {
    this.updateMethod(method);
    this.updateUrl(url);

    this.requestContent = data;
    this.requestHeaders = headers;
  };

  handleSuccess = response => {
    removeRequestListener(this.handleRequest, this.handleSuccess, this.handleError);
    this.setState({ showLoader: false });
    if (response && response.status) {
      try {
        response.text().then(value => {
          const headers = {};
          response.headers.forEach((item, key) => headers[key] = item);
          this.addRow({
            method: this.state.method,
            url: response.url,
            status: response.status,
            type: response.type,
            time: this.stopTimer(),
            requestHeaders: this.requestHeaders,
            requestContent: this.requestContent,
            responseHeaders: headers,
            responseContent: value
          });
        })
      } catch (err) {

      }
    }
  };

  handleError = response => {
    removeRequestListener(this.handleRequest, this.handleSuccess, this.handleError);
    this.setState({ showLoader: false });

    if (response instanceof TypeError) {
      this.addRow({
        method: this.state.method,
        url: this.state.url,
        status: '(Failed)',
        type: '',
        time: this.stopTimer(),
        requestHeaders: this.requestHeaders,
        requestContent: this.requestContent,
        responseHeaders: {},
        responseContent: response.message
      });
    } else if (response && response.status) {
      response.text().then(value => {
        const headers = {};
        response.headers.forEach((item, key) => headers[key] = item);
        this.addRow({
          method: this.state.method,
          url: response.url,
          status: response.status,
          type: response.type,
          time: this.stopTimer(),
          requestHeaders: this.requestHeaders,
          requestContent: this.requestContent,
          responseHeaders: headers,
          responseContent: value
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
    let rows = [ ...this.state.rows.slice(0, 2) ];
    this.setState({ rows });
    rows = [ row, ...this.state.rows ];
    localStorage[this.persistKey + '.rows'] = JSON.stringify(rows);
    setTimeout(() => this.setState({ rows }), 10);
  };

  getData() {
    const finalData = {};
    if (this.props.params) {
      this.props.params.forEach(param => finalData[param] = this.params[param]);
    }
    return finalData;
  }

  render() {
    const config = typeof this.context.getConfig === 'function' ? this.context.getConfig() : {};

    let url = this.state.url;
    if (url && config.url) {
      const re = new RegExp(`^${config.url}`);
      url = url.replace(re, '');
    }

    let params = this.renderParams();
    let paramRow;
    if (params) {
      paramRow = (
        <div style={styles.fields}>
          <Label>Parameters</Label>
          {this.renderParams()}
        </div>
      );
    }
    if (this.state.isMinified) {
      return (
        <div style={styles.container}>
          <span style={styles.name} onClick={this.maximize}>
            <svg x="0px" y="0px" width="10px" height="10px" viewBox="0 0 10 10" style={{ marginRight: '4px' }}>
              <path  fill="#ffffff" d="M6,6l3.5,0C9.8,6,10,5.9,10,5.6l0-1.2C10,4.1,9.8,4,9.6,4L6,4
                l0-3.5C6,0.2,5.9,0,5.6,0L4.4,0C4.1,0,4,0.2,4,0.4L4,4L0.4,4C0.2,4,0,4.1,0,4.4l0,1.2C0,5.9,0.2,6,0.4,6L4,6l0,3.5
                C4,9.8,4.1,10,4.4,10l1.3,0C5.9,10,6,9.8,6,9.6L6,6z"/>
            </svg>
            {this.props.name}
          </span>
        </div>
      );
    }
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <span style={styles.name} onClick={this.minify}>
            <svg x="0px" y="0px" width="10px" height="10px" viewBox="0 0 10 2.1" style={{ marginRight: '4px' }}>
              <path
                fill="#ffffff"
                d="M9.6,2.1c0.2,0,0.4-0.2,0.4-0.4l0-1.2C10,0.2,9.8,0,9.6,0L0.4,0
                C0.2,0,0,0.2,0,0.4l0,1.2c0,0.2,0.2,0.4,0.4,0.4L9.6,2.1z"
              />
            </svg>
            {this.props.name}
          </span>
          <Loader size="12" style={{ marginLeft: '10px', opacity: this.state.showLoader ? 1 : 0 }}/>
          <span style={styles.method}>
            {this.state.method}
          </span>
          <span style={styles.url}>
            {url}
          </span>
          <div style={styles.actions}>
            <a onClick={this.reset} style={styles.reset}>
              Reset
              <svg x="0px" y="0px" width="10px" height="10px" viewBox="0 0 10 10" style={{ marginLeft: '4px' }}>
                <path
                  fill="#ff3900"
                  d="M6.8,5l3.1-3.1c0.2-0.2,0.2-0.5,0-0.7L8.8,0.1C8.6,0,8.3,0,8.1,0.1
                  L5,3.2L1.9,0.1C1.7,0,1.4,0,1.2,0.1L0.1,1.2C0,1.4,0,1.7,0.1,1.9L3.2,5L0.1,8.1C0,8.3,0,8.6,0.1,8.8l1.1,1.1c0.2,0.2,0.5,0.2,0.7,0
                  L5,6.8l3.1,3.1c0.2,0.2,0.5,0.2,0.7,0l1.1-1.1c0.2-0.2,0.2-0.5,0-0.7L6.8,5z"
                />
              </svg>
            </a>
            <a onClick={this.request} style={styles.run}>
              Run
              <svg x="0px" y="0px" width="5px" height="10px" viewBox="0 0 5 10" style={{ marginLeft: '4px' }}>
                <polygon fill="#a8ff00" points="0,0 0,10 5,5 "/>
              </svg>
            </a>
          </div>
        </div>
        {paramRow}
        <div>
          <Table headers={['Method', 'URL', 'Status', 'Type', 'Time', 'Request Headers', 'Request Content', 'Response Headers', 'Response Content' ]}>
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
        let type = param.indexOf('password') !== -1 ? 'password' : null;
        children.push(
          <Field
            key={param}
            type={type}
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
    const config = typeof this.context.getConfig === 'function' ? this.context.getConfig() : {};

    return this.state.rows.map((row, index) => {
      let color = '#eeeeee';
      if (row['status'] !== 200) color = '#ff0000';
      return (
        <Row key={index}>
          {Object.keys(row).map(key => {
            let value = row[key];
            if (typeof value === 'object') {
              value = <JsonViewer json={value}/>;
            } else if (
              typeof row[key] === 'string' &&
              ((row[key].charAt(0) === '{' && row[key].charAt(row[key].length - 1) === '}') || (row[key].charAt(0) === '[' && row[key].charAt(row[key].length - 1) === ']'))
            ) {
              try {
                value = <JsonViewer json={JSON.parse(row[key])}/>;
              } catch (err) {
                value = row[key];
              }
            } else if (key === 'url') {
              if (config.url) {
                const re = new RegExp(`^${config.url}`);
                value = value.replace(re, '');
              }
            }
            return (<Column key={key} style={{ color }}>{value}</Column>);
          })}
        </Row>
      );
    });
  }
}

export default Request;

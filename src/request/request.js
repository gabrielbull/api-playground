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

  name: {
    display: 'inline-block',
    width: '200px'
  },

  fields: {
    display: 'flex',
    marginTop: '20px'
  },

  run: {
    color: '#a8ff00',
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
      rows: []
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
    setTimeout(() => this.setState({ rows }), 250);
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

    return (
      <div style={styles.container}>
        <span style={styles.name}>
          {this.props.name}
        </span>
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
          {url}
        </span>
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

import React, { Component, PropTypes, Children, cloneElement } from 'react';
import './request/network';
import Field from './ui/field';
import Tabs, { Tab } from './main/tabs/tabs';
import Action from './ui/action';
import { functionName } from './helper';

document.body.innerHTML = `
  <div id="main"></div>
`;

let script = document.createElement('script');
document.getElementsByTagName('head')[0].appendChild(script);

document.body.style.padding = '30px 40px';
document.body.style.color = 'white';
document.body.style.fontFamily = 'monaco, Consolas, Lucida Console, monospace';
document.body.style.fontSize = '12px';
document.body.style.backgroundColor = '#141517';

const styles = {
  controls: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: '20px'
  },

  itemContainer: {
    paddingTop: '20px'
  }
};

class Playground extends Component {
  static childContextTypes = {
    store: PropTypes.object,
    getConfig: PropTypes.func,
    changeConfig: PropTypes.func,
    playground: PropTypes.object
  };

  constructor(...args) {
    super(...args);
    this.state = {};
    let defaultConfig = {};
    if (typeof this.props.getConfig === 'function') {
      defaultConfig = this.props.getConfig();
    }
    try {
      this.state = {
        ...defaultConfig,
        ...JSON.parse(localStorage['playground-state'])
      }
    } catch (err) {
    }

    for (let prop in defaultConfig) {
      if (defaultConfig.hasOwnProperty(prop)) {
        if (defaultConfig[prop] !== this.state[prop] && typeof this.props.changeConfig === 'function') {
          this.props.changeConfig(prop, this.state[prop]);
        }
      }
    }
  }

  getChildContext() {
    return {
      store: this.props.store,
      getConfig: this.props.getConfig,
      playground: this
    };
  }

  componentDidUpdate() {
    localStorage['playground-state'] = JSON.stringify(this.state);
  }

  reset = () => {
    for (var prop in localStorage) {
      if (localStorage.hasOwnProperty(prop)) {
        delete localStorage[prop];
      }
    }
    window.location.reload(true);
  };

  changeConfig = (key, value) => {
    if (typeof this.props.changeConfig === 'function') {
      this.props.changeConfig(key, value);
      let state = {};
      state[key] = value;
      this.setState(state);
    }
  };

  render() {
    let configChildren = [];
    if (typeof this.props.getConfig === 'function') {
      let configs = this.props.getConfig();
      for (let prop in configs) {
        if (configs.hasOwnProperty(prop)) {
          configChildren.push(
            <Field key={prop} name={prop} value={configs[prop]} onChange={(v) => this.changeConfig(prop, v)}/>
          );
        }
      }
    }

    return (
      <div>
        <div style={styles.controls}>
          <div style={{ marginRight: 'auto', display: 'flex', flexWrap: 'wrap' }}>
            {configChildren}
          </div>
          <Action color="red" name="Reset" action={this.reset}/>
        </div>

        {this.renderTabs()}

        <div style={styles.itemContainer}>
          {this.renderContent()}
        </div>
      </div>
    );
  }

  renderContent() {
    return Children.map(this.props.children, child => {
      const name = functionName(child.type.prototype.__proto__.constructor);
      if (!this.state.selected) this.state.selected = name;
      return name === this.state.selected ? cloneElement(child, { hide: false, name }) : cloneElement(child, { hide: true, name });
    });
  }

  renderTabs() {
    return (
      <Tabs>
        {Children.map(this.props.children, child => {
          const name = functionName(child.type.prototype.__proto__.constructor);
          if (!this.state.selected) this.state.selected = name;
          if (this.state.selected === name && this.state.markUpdated === name) {
            this.state.markUpdated = null;
          }
          return (
            <Tab
              selected={this.state.selected === name}
              markUpdated={this.state.markUpdated === name}
              onClick={() => this.setState({ selected: name })}
            >
              {name}
            </Tab>
          );
        })}
      </Tabs>
    );
  }

  markUpdate(name) {
    this.setState({ markUpdated: name });
  }
}

export default Playground;

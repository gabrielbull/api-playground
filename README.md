# API Playground

Components to create playgrounds for APIs easily.

## Example Playground

```jsx
import React  from 'react';
import ReactDOM from 'react-dom';
import { compose, applyMiddleware, createStore } from 'redux';
import { logger, Playground } from 'api-playground';
import MyComponentExample from './myComponentExample';

let reduxStore = createStore(e => e, {}, compose(
  applyMiddleware(logger)
));

let config = { example: 'hello' };

ReactDOM.render((
  <Playground
    store={reduxStore}
    getConfig={config}
    changeConfig={(key, value) => config[key] = value}
  >
    <MyComponentExample/>
  </Playground>
), document.getElementById('main'));
```

## Example Component

```jsx
import React, { PropTypes, Component } from 'react';
import { PlaygroundComponent, View, Section, Ui } from 'api-playground';

@PlaygroundComponent
class MyComponentExample extends Component {
  static contextTypes = {
    store: PropTypes.object
  };

  static subscribe = 'reduxStateKey';

  addItem = (value) => {
    this.refs.modal.setState({ isOpen: false });
  };

  removeItem = (index) => {
  };

  actions = {
    addItem: this.addItem,
    removeItem: this.removeItem
  };

  render() {
    return (
      <View>
        <Section.Items
          showTotals={['quantity']}
          items={this.state}
          removeItem={this.removeItem}
        />
        <Section>
          <Section.Param name="Quantity" value={this.state.length}/>
        </Section>
        <Section>
          <Section.Request ref="request"/>
        </Section>
        <Ui.Modal ref="modal">
          <Section.Form
            name="Item"
            defaults={{ item: 'defaultValue' }}
            action={this.addItem}
          />
        </Ui.Modal>
      </View>
    );
  }
}

export default MyComponentExample;
```

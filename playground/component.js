import React, { PropTypes, Component } from 'react';
import { PlaygroundComponent, View, Section, Ui } from '../src/index';

@PlaygroundComponent
class MyComponentExample extends Component {
  static contextTypes = {
    store: PropTypes.object
  };

  static subscribe = 'reduxStateKey';

  showAddItemModal = () => {
    this.refs.modal.setState({ isOpen: true });
  };

  addItem = (value) => {
    this.refs.modal.setState({ isOpen: false });
  };

  removeItem = (index) => {
  };

  actions = {
    addItem: this.showAddItemModal,
    removeItem: this.removeItem
  };

  render() {
    return (
      <View>
        <Section.Items
          showTotals={['quantity']}
          items={this.state.reduxStateKey}
          removeItem={this.removeItem}
        />
        <Section>
          <Section.Param name="Quantity" value={this.state.reduxStateKey.length}/>
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

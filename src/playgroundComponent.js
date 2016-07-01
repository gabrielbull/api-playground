import React, { PropTypes } from 'react';
import { functionName } from './helper';

const styles = {
  marginLeft: '16px',
  marginRight: '16px',
  marginTop: '14px',
  marginBottom: '20px',
  borderBottom: '1px solid #222'
};

let id = 0;

function ExtendComposedComponent(options, ComposedComponent) {
  class Component extends ComposedComponent {
    static propTypes = {
      name: PropTypes.string
    };

    static contextTypes = {
      store: PropTypes.object
    };

    static childContextTypes = {
      playgroundComponent: PropTypes.number,
      name: PropTypes.string
    };

    getChildContext() {
      return {
        playgroundComponent: this.id,
        name: this.props.name
      };
    }

    id;

    constructor(props, context, updater) {
      super(props, context, updater);
      this.id = id = id + 1;

      try {
        this.state = JSON.parse(localStorage['component-state-' + functionName(ComposedComponent)]);
      } catch (err) {
        if (!this.state) {
          this.state = {};
        }
      }

      this.state[this.constructor.subscribe] = context.store.getState()[this.constructor.subscribe];

      context.store.subscribe(
        () => {
          let newState = {};
          newState[this.constructor.subscribe] = context.store.getState()[this.constructor.subscribe];
          super.setState(newState);
        }
      );
    }

    render() {
      let rendered = super.render();
      let componentStyle = { ...styles };
      if (this.props.hide) componentStyle.display = 'none';
      else componentStyle.display = 'block';

      return (
        <div style={componentStyle}>
          {rendered}
        </div>
      );
    }
  }

  return Component;
}

export default function PlaygroundComponent(...args) {
  if (args.length === 1 && typeof args[0] === 'function') {
    return ExtendComposedComponent.apply(null, [[], args[0]]);
  }
  return ExtendComposedComponent.bind(null, args);
}

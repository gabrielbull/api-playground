import React  from 'react';
import ReactDOM from 'react-dom';
import { compose, applyMiddleware, createStore } from 'redux';
import { logger, Playground } from '../src/index';
import { AppContainer } from 'react-hot-loader';
import MyComponentExample from './component';

let reduxStore = createStore(e => e, { reduxStateKey: [] }, compose(
  applyMiddleware(logger)
));

let config = () => ({ example: 'hello' });

ReactDOM.render((
  <AppContainer>
    <Playground
      store={reduxStore}
      getConfig={config}
      changeConfig={(key, value) => config[key] = value}
    >
      <MyComponentExample/>
    </Playground>
  </AppContainer>
), document.getElementById('main'));


//      <MyComponentExample/>

import React from 'react';
import ReactDOM from 'react-dom/client';
import ShoppingCart from './ShoppingCart';
import {Provider} from 'react-redux';
import store from './store/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
      <Provider store={store}>
            <ShoppingCart />
      </Provider>
);

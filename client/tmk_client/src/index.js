import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Store from './Store/Store';

const store = new Store();

export const Context = createContext({
  store,
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <Context.Provider value={{ store }}>
    <App />
  </Context.Provider>
);

/* const store = new Store();

export const Context = createContext({
  store,
})

ReactDOM.render(
  <Context.Provider value={{ store }}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Context.Provider>,
  document.getElementById('root')
); */
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

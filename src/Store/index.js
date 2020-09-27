import {createStore, compose, applyMiddleware} from 'redux';
import {persistStore, persistCombineReducers} from 'redux-persist';
import {AsyncStorage} from 'react-native'; 
import logger from 'redux-logger';
import reducers from '../Reducer'; // where reducers is a object of reducers


// const config = {
//   key: 'root',
//   storage:AsyncStorage,
//   blacklist: [],
//   whitelist: ['rideReducer'],
//   debug: true, //to get useful logging
// };

const middleware = [];

if (process.env.NODE_ENV === 'development') {
  console.log("process log== env",process.env.NODE_ENV);
  middleware.push(logger);
}

// const reducers = persistCombineReducers(config, rootReducers);
// const enhancers = [applyMiddleware(...middleware)];
// // const initialState = {};
// const persistConfig = {enhancers};
// const store = createStore(reducers, undefined, compose(...enhancers));
// const persistor = persistStore(store, persistConfig, () => {
//   //   console.log('Initial store', store.getState());
// });
// const configureStore = () => {
//   return {persistor, store};
// };

//sagaMiddleware.run(sagas);
const store = createStore(reducers, applyMiddleware(...middleware));

export default store;

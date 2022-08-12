import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import authReducer from './authreducer';

const rootReducer = combineReducers({ authReducer });

export const Store = createStore(rootReducer, applyMiddleware(thunk));

import { createStore, compose, applyMiddleware } from 'redux'
import { reduxObservable } from 'redux-observable'
import rootReducer from '../reducers'

export default function configureStore (initialState) {
  let finalCreateStore = compose(
    applyMiddleware(reduxObservable()),
    global.devToolsExtension ? global.devToolsExtension() : (f) => f
  )(createStore)

  const store = finalCreateStore(rootReducer, initialState)

  return store
}

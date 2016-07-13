import {combineReducers} from 'redux'
import {routerReducer} from 'react-router-redux'
import {
  ADD_PHRASE_FULFILLED,
  FETCH_PHRASES_FULFILLED,
  UPDATE_FILTER
} from '../actions'

const phrases = (state = [], action) => {
  switch (action.type) {
    case ADD_PHRASE_FULFILLED:
    case FETCH_PHRASES_FULFILLED:
      return action.payload.data
    default:
      return state
  }
}

const filter = (state = '', action) => {
  switch (action.type) {
    case UPDATE_FILTER:
      return action.filter
    default:
      return state
  }
}

export default combineReducers({
  phrases,
  filter,
  routing: routerReducer
})

import Rx from 'rxjs/Rx'
import Kinto from 'kinto'

const db = new Kinto()
const phrases = db.collection('phrases')

export const ADD_PHRASE_FULFILLED = 'ADD_PHRASE_FULFILLED'
export const ADD_PHRASE_PENDING = 'ADD_PHRASE_PENDING'
export const FETCH_PHRASES_FULFILLED = 'FETCH_PHRASES_FULFILLED'
export const FETCH_PHRASES_PENDING = 'FETCH_PHRASES_PENDING'
export const UPDATE_FILTER = 'UPDATE_FILTER'

export const addPhrase = (phrase) => {
  const promise = phrases
    .create(Object.assign({}, phrase, {
      created: new Date(),
      updated: new Date()
    }))
    .then((res) => phrases.list())
  return (actions, store) => Rx.Observable
    .fromPromise(promise)
    .map((payload) => ({type: ADD_PHRASE_FULFILLED, payload}))
    .startWith({type: ADD_PHRASE_PENDING})
}

export const fetchPhrases = () => {
  const promise = phrases
    .list()
  return (actions, store) => Rx.Observable
    .fromPromise(promise)
    .map((payload) => ({type: FETCH_PHRASES_FULFILLED, payload}))
    .startWith({type: FETCH_PHRASES_PENDING})
}

export const filterPhrases = (filter) => {
  return {type: UPDATE_FILTER, filter}
}

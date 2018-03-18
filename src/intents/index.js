import Rx from 'rxjs/Rx'
import {
  INIT,
  ADD_PHRASE,
  FETCH_PHRASES,
  UPDATE_FILTER
} from '../constants'

export const intentSubject = new Rx.BehaviorSubject({type: INIT})

export const addPhrase = (phrase) => {
  intentSubject.next({
    type: ADD_PHRASE,
    phrase
  })
}

export const fetchPhrases = () => {
  intentSubject.next({
    type: FETCH_PHRASES
  })
}

export const filterPhrases = (filter) => {
  intentSubject.next({
    type: UPDATE_FILTER,
    filter
  })
}

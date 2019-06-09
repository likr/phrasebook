import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { INIT, ADD_PHRASE, FETCH_PHRASES, UPDATE_FILTER } from '../constants'

export const intentSubject = new BehaviorSubject({ type: INIT })

export const addPhrase = phrase => {
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

export const filterPhrases = filter => {
  intentSubject.next({
    type: UPDATE_FILTER,
    filter
  })
}

import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import Kinto from 'kinto'
import {
  ADD_PHRASE,
  FETCH_PHRASES
} from '../constants'

const store = (intentSubject) => {
  const db = new Kinto()
  const phrases = db.collection('phrases')

  const state = {
    phrases: []
  }

  const subject = new BehaviorSubject({ state, changed: false })

  intentSubject.subscribe((payload) => {
    switch (payload.type) {
      case ADD_PHRASE:
        phrases
          .create(Object.assign({}, payload.phrase, {
            created: new Date(),
            updated: new Date()
          }))
          .then((res) => phrases.list({ order: '-updated' }))
          .then(({ data }) => {
            Object.assign(state, {
              phrases: data
            })
            subject.next({ state, changed: true })
          })
        break
      case FETCH_PHRASES:
        phrases.list({ order: '-updated' })
          .then(({ data }) => {
            Object.assign(state, {
              phrases: data
            })
            subject.next({ state, changed: true })
          })
        break
      default:
        subject.next({ state, changed: false })
    }
  })

  return subject
}

export default store

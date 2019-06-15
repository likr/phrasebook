import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { UPDATE_FILTER } from '../constants'

const store = (intentSubject, phraseSubject) => {
  const state = {
    filter: ''
  }

  const subject = new BehaviorSubject({ state, changed: false })

  intentSubject.subscribe((payload) => {
    switch (payload.type) {
      case UPDATE_FILTER:
        state.filter = payload.filter
        subject.next({ state, changed: true })
        break
      default:
        subject.next({ state, changed: false })
    }
  })

  return subject
}

export default store

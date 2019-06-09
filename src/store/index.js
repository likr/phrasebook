import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/zip'
import { intentSubject } from '../intents'
import phraseStore from './phrase'
import filterStore from './filter'

const store = () => {
  const phraseSubject = phraseStore(intentSubject)
  const filterSubject = filterStore(intentSubject)

  const state = {
    phrases: []
  }

  return Observable.zip(phraseSubject, filterSubject, (phrase, filter) => {
    if (phrase.changed || filter.changed) {
      state.phrases = phrase.state.phrases.filter(({ japanese, english }) => {
        return (
          !japanese ||
          japanese.indexOf(filter.state.filter) >= 0 ||
          (!english || english.indexOf(filter.state.filter) >= 0)
        )
      })
    }
    return state
  })
}

export default store

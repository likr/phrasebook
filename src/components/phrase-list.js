import React from 'react'
import store from '../store'
import { addPhrase, fetchPhrases, filterPhrases } from '../intents'
import styles from './phrase-list.css'

const formatDate = date => {
  if (!date) {
    return ''
  }
  return `${date.getFullYear()}/${date.getMonth() +
    1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
}

class PhraseList extends React.Component {
  constructor() {
    super()
    this.state = {
      phrases: []
    }
  }

  componentDidMount() {
    this.subscription = store().subscribe(({ phrases }) => {
      this.setState({ phrases })
    })
    fetchPhrases()
  }

  componentWillUnmount() {
    this.subscription.unsubscribe()
  }

  render() {
    const { phrases } = this.state
    return (
      <div className={styles.phraseList}>
        <div>
          <h2>Add phrase</h2>
          <form className='pure-form pure-form-stacked'>
            <fieldset>
              <label htmlFor='japanese'>Japanese</label>
              <textarea
                className='pure-input-1'
                style={{ resize: 'none' }}
                rows='2'
                ref='japanese'
                id='japanese'
                placeholder='これはペンです。'
              />
              <label htmlFor='english'>English</label>
              <textarea
                className='pure-input-1'
                style={{ resize: 'none' }}
                rows='2'
                ref='english'
                id='english'
                placeholder='This is a pen.'
              />
              <button
                className={`pure-button ${styles.submitButton}`}
                onClick={e => this.handleClickAddPhraseButton(e)}
              >
                add phrase
              </button>
            </fieldset>
          </form>
        </div>
        <div>
          <h2>Phrases</h2>
          <div className={styles.searchBox}>
            <form className='pure-form'>
              <input
                ref='query'
                aria-label='Search'
                className='pure-input-rounded pure-input-1'
                placeholder='search...'
                onChange={e => this.handleChangeQuery(e)}
              />
            </form>
          </div>
          <div style={{}}>
            {phrases.map(phrase => {
              const { id, japanese, english, created } = phrase
              return (
                <div key={id} className={styles.phrase}>
                  <p className={styles.date}>{formatDate(created)}</p>
                  <p>{japanese}</p>
                  <p>{english}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  handleClickAddPhraseButton(event) {
    event.preventDefault()
    const japanese = this.refs.japanese.value
    const english = this.refs.english.value
    this.refs.japanese.value = ''
    this.refs.english.value = ''
    addPhrase({ japanese, english })
  }

  handleChangeQuery() {
    filterPhrases(this.refs.query.value)
  }
}

export default PhraseList

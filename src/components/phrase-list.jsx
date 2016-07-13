import React from 'react'
import {connect} from 'react-redux'
import {
  addPhrase,
  fetchPhrases,
  filterPhrases
} from '../actions'
import styles from './phrase-list.css'

const formatDate = (date) => {
  if (!date) {
    return ''
  }
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDay()} ${date.getHours()}:${date.getMinutes()}`
}

class PhraseList extends React.Component {
  componentWillMount () {
    const {fetchPhrases} = this.props
    fetchPhrases()
  }

  render () {
    const {phrases} = this.props
    return <div className={styles.phraseList}>
      <div>
        <h2>Add phrase</h2>
        <form className='pure-form pure-form-stacked'>
          <fieldset>
            <label htmlFor='japanese'>Japanese</label>
            <textarea className='pure-input-1' style={{resize: 'none'}} rows='2' ref='japanese' id='japanese' placeholder='これはペンです。' />
            <label htmlFor='english'>English</label>
            <textarea className='pure-input-1' style={{resize: 'none'}} rows='2' ref='english' id='english' placeholder='This is a pen.' />
            <button className={`pure-button ${styles.submitButton}`} onClick={this.handleClickAddPhraseButton.bind(this)}>add phrase</button>
          </fieldset>
        </form>
      </div>
      <div>
        <h2>Phrases</h2>
        <div className={styles.searchBox}>
          <form className='pure-form'>
            <input ref='query' className='pure-input-rounded pure-input-1' placeholder='search...' onChange={this.handleChangeQuery.bind(this)}/>
          </form>
        </div>
        <div style={{}}>
          {phrases.map((phrase) => {
            const {id, japanese, english, created} = phrase
            return <div key={id} className={styles.phrase}>
              <p className={styles.date}>{formatDate(created)}</p>
              <p>{japanese}</p>
              <p>{english}</p>
            </div>
          })}
        </div>
      </div>
    </div>
  }

  handleClickAddPhraseButton (event) {
    event.preventDefault()
    const {addPhrase} = this.props
    const japanese = this.refs.japanese.value
    const english = this.refs.english.value
    this.refs.japanese.value = ''
    this.refs.english.value = ''
    addPhrase({japanese, english})
  }

  handleChangeQuery () {
    const {filterPhrases} = this.props
    filterPhrases(this.refs.query.value)
  }
}

const mapStateToProps = (state) => {
  const filter = state.filter
  const phrases = state.phrases.filter(({japanese, english}) => {
    return japanese.indexOf(filter) >= 0 || english.indexOf(filter) >= 0
  })
  phrases.sort((p1, p2) => {
    return (p2.created ? p2.created.getTime() : 0) - (p1.created ? p1.created.getTime() : 0)
  })
  return {phrases}
}

const mapDispatchToProps = {
  addPhrase,
  fetchPhrases,
  filterPhrases
}

export default connect(mapStateToProps, mapDispatchToProps)(PhraseList)


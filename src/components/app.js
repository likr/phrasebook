import React from 'react'
import {
  BrowserRouter as Router
} from 'react-router-dom'
import {
  IonApp,
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonTextarea,
  IonTitle,
  IonToolbar
} from '@ionic/react'
import {
  addPhrase,
  fetchPhrases,
  filterPhrases
} from '../intents'
import store from '../store'

class PhraseList extends React.Component {
  constructor () {
    super()
    this.state = {
      phrases: []
    }
  }

  componentDidMount () {
    this.subscription = store().subscribe(({ phrases }) => {
      this.setState({ phrases })
    })
    fetchPhrases()
  }

  componentWillUnmount () {
    this.subscription.unsubscribe()
  }

  render () {
    const { phrases } = this.state
    return <IonContent padding>
      <h1>Main Content</h1>
      <p>hello hello</p>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          const japanese = this.refs.japanese.value
          const english = this.refs.english.value
          this.refs.japanese.value = ''
          this.refs.english.value = ''
          addPhrase({ japanese, english })
        }}
      >
        <IonItem>
          <IonLabel position='floating'>Japanese</IonLabel>
          <IonTextarea ref='japanese' required />
        </IonItem>
        <IonItem>
          <IonLabel position='floating'>English</IonLabel>
          <IonTextarea ref='english' required />
        </IonItem>
        <IonButton expand='block' type='submit'>Add Phrase</IonButton>
      </form>
      <IonList>
        {
          phrases.map((phrase) => {
            const { id, japanese, english, created } = phrase
            return <IonItem key={id}>
              {created.toString()} {japanese} {english}
            </IonItem>
          })
        }
      </IonList>
    </IonContent>
  }
}

const App = () => {
  return <Router>
    <IonApp>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Phrasebook</IonTitle>
        </IonToolbar>
      </IonHeader>
      <PhraseList />
      <IonFooter>
        <IonTitle>Footer</IonTitle>
      </IonFooter>
    </IonApp>
  </Router>
}

export default App

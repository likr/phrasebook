import React from 'react'
import {
  IonFab,
  IonFabButton,
  IonIcon,
  IonItem,
  IonList
} from '@ionic/react'
import {
  addPhrase,
  fetchPhrases
} from '../../intents'
import store from '../../store'
import AddPhraseModal from './AddPhraseModal'

class PhraseList extends React.Component {
  constructor () {
    super()
    this.state = {
      showModal: false,
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
    const {
      phrases,
      showModal
    } = this.state

    return <div>
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
      <IonFab vertical='bottom' horizontal='end' slot='fixed'>
        <IonFabButton
          onClick={() => {
            this.setState({
              showModal: true
            })
          }}
        >
          <IonIcon name='add' />
        </IonFabButton>
      </IonFab>
      <AddPhraseModal
        isOpen={showModal}
        onDidDismiss={(result) => {
          this.setState({
            showModal: false
          })
          if (result) {
            addPhrase(result)
          }
        }}
      />
    </div>
  }
}

export default PhraseList

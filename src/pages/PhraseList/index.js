import React from 'react'
import {
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList
} from '@ionic/react'
import { addPhrase, fetchPhrases } from '../../intents'
import store from '../../store'
import AddPhraseModal from './AddPhraseModal'

class PhraseList extends React.Component {
  constructor() {
    super()
    this.state = {
      showModal: false,
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
    const { phrases, showModal } = this.state

    return (
      <>
        <IonContent padding>
          <IonList>
            {phrases.map((phrase) => {
              const { id, japanese, english, created } = phrase
              return (
                <IonItem key={id}>
                  <IonLabel>
                    <p>{created.toString()}</p>
                  </IonLabel>
                  <div>
                    <p>{japanese}</p>
                  </div>
                  <div>
                    <p>{english}</p>
                  </div>
                </IonItem>
              )
            })}
          </IonList>
        </IonContent>
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
      </>
    )
  }
}

export default PhraseList

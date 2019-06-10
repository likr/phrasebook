import React from 'react'
import PropTypes from 'prop-types'
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonModal,
  IonPage,
  IonTextarea,
  IonTitle,
  IonToolbar
} from '@ionic/react'

const AddPhraseModal = ({ isOpen, onDidDismiss }) => {
  const japaneseRef = React.createRef()
  const englishRef = React.createRef()
  return (
    <IonModal isOpen={isOpen} onDidDismiss={onDidDismiss}>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot='start'>
              <IonButton
                onClick={() => {
                  onDidDismiss(null)
                }}
              >
                Cancel
              </IonButton>
            </IonButtons>
            <IonTitle>Add Phrase</IonTitle>
            <IonButtons slot='end'>
              <IonButton
                onClick={() => {
                  const japanese = japaneseRef.current.value
                  const english = englishRef.current.value
                  onDidDismiss({ japanese, english })
                }}
                strong
              >
                Add
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonItem>
            <IonLabel position='floating'>Japanese</IonLabel>
            <IonTextarea ref={japaneseRef} required />
          </IonItem>
          <IonItem>
            <IonLabel position='floating'>English</IonLabel>
            <IonTextarea ref={englishRef} required />
          </IonItem>
        </IonContent>
      </IonPage>
    </IonModal>
  )
}

AddPhraseModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onDidDismiss: PropTypes.func.isRequired
}

export default AddPhraseModal

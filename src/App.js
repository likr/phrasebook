import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
import {
  IonApp,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar
} from '@ionic/react'
import PhraseList from './pages/PhraseList'

const App = () => {
  return <Router>
    <IonApp>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Phrasebook</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent padding>
        <Switch>
          <Route path='/' component={PhraseList} />
        </Switch>
      </IonContent>
    </IonApp>
  </Router>
}

export default App

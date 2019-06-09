import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { IonApp, IonHeader, IonTitle, IonToolbar } from '@ionic/react'
import PhraseList from './pages/PhraseList'

const App = () => {
  return (
    <Router>
      <IonApp>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Phrasebook</IonTitle>
          </IonToolbar>
        </IonHeader>
        <Switch>
          <Route path="/" component={PhraseList} />
        </Switch>
      </IonApp>
    </Router>
  )
}

export default App

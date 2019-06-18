import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import {
  IonApp,
  IonButton,
  IonButtons,
  IonHeader,
  IonTitle,
  IonToolbar
} from '@ionic/react'
import { GoogleLogin, GoogleLogout } from 'react-google-login'
import PhraseList from './pages/PhraseList'

const LoginButton = ({ setToken }) => {
  return (
    <GoogleLogin
      clientId='687186412701-u05jejp1ebihgblocaci911g0qp0994v.apps.googleusercontent.com'
      render={({ onClick, disabled }) => {
        return (
          <IonButton onClick={onClick} disabled={disabled}>
            Login
          </IonButton>
        )
      }}
      onSuccess={(result) => {
        const token = result.Zi.access_token
        window.localStorage.setItem('token', token)
        setToken(token)
      }}
      onFailure={(result) => console.log(result)}
      isSignedIn
      cookiePolicy='single_host_origin'
    />
  )
}

const LogoutButton = ({ setToken }) => {
  return (
    <GoogleLogout
      clientId='687186412701-u05jejp1ebihgblocaci911g0qp0994v.apps.googleusercontent.com'
      render={({ onClick, disabled }) => {
        return (
          <IonButton onClick={onClick} disabled={disabled}>
            Logout
          </IonButton>
        )
      }}
      onLogoutSuccess={() => {
        window.localStorage.setItem('token', null)
        setToken(null)
      }}
    />
  )
}

const App = () => {
  const [token, setToken] = React.useState(window.localStorage.getItem('token'))

  const AuthButton = token ? LogoutButton : LoginButton
  return (
    <Router>
      <IonApp>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot='secondary'>
              <AuthButton setToken={setToken} />
            </IonButtons>
            <IonTitle>Phrasebook</IonTitle>
          </IonToolbar>
        </IonHeader>
        <Switch>
          <Route path='/' render={() => <PhraseList token={token} />} />
        </Switch>
      </IonApp>
    </Router>
  )
}

export default App

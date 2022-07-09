import { useAuth0 } from "@auth0/auth0-react";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Redirect } from "react-router-dom";

export default function Login() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  if (isAuthenticated) {
    <Redirect to="/" />;
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>PhraseBook</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div slot="fixed" style={{ textAlign: "center" }}>
          <p>英語のフレーズをメモするアプリです。</p>
          <IonButton
            onClick={() => {
              loginWithRedirect();
            }}
          >
            Login
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}

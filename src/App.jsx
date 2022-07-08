import { Route } from "react-router-dom";
import { IonReactRouter } from "@ionic/react-router";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import PhraseList from "./pages/PhraseList";

export default function App() {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/" component={PhraseList} exact />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}

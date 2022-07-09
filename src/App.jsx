import { Redirect, Route } from "react-router-dom";
import { IonReactRouter } from "@ionic/react-router";
import { IonApp, IonLoading, IonRouterOutlet } from "@ionic/react";
import PhraseList from "./pages/PhraseList";
import Login from "./pages/Login";
import { useAuth0 } from "@auth0/auth0-react";

function SecretRoute({ component: Component, ...rest }) {
  const { isAuthenticated } = useAuth0();
  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuthenticated) {
          return <Component {...props} />;
        }
        return <Redirect to="/login" />;
      }}
    ></Route>
  );
}

export default function App() {
  const { isLoading } = useAuth0();
  return (
    <IonApp>
      <IonReactRouter>
        {isLoading ? (
          <IonLoading isOpen />
        ) : (
          <IonRouterOutlet>
            <SecretRoute path="/" component={PhraseList} exact />
            <Route path="/login" component={Login} />
          </IonRouterOutlet>
        )}
      </IonReactRouter>
    </IonApp>
  );
}

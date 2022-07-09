import "@ionic/react/css/core.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/padding.css";

import { createRoot } from "react-dom/client";
import App from "./App";
import { setupIonicReact } from "@ionic/react";
import { Auth0Provider } from "@auth0/auth0-react";

setupIonicReact();
createRoot(document.querySelector("#content")).render(
  <Auth0Provider
    domain="vdslab.jp.auth0.com"
    clientId="VgnmdEvEQ4gYTQ85Yv1irPR2KNenT58e"
    redirectUri={window.location.origin}
    audience="https://hasura-jphrasebook-3wi5srugvq-an.a.run.app/"
  >
    <App />
  </Auth0Provider>
);

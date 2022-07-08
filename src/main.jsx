import "@ionic/react/css/core.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/padding.css";

import { createRoot } from "react-dom/client";
import App from "./App";
import { setupIonicReact } from "@ionic/react";

setupIonicReact();
createRoot(document.querySelector("#content")).render(<App />);

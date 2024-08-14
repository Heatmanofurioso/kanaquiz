import React from "react";
import ReactDOM, {Root} from "react-dom/client";
import 'bootstrap/dist/css/bootstrap.min.css';
import App from "./components/App/App";
import reportWebVitals from "./reportWebVitals";

const rootElement: HTMLElement | null = document.getElementById('root');
reportWebVitals();
if (rootElement) {
  const root: Root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('Root element not found');
}

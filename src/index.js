import React from "react";
import ReactDOM from "react-dom/client";
import Main from "./Main";
import store from "./store/index";
import { Provider } from "react-redux";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./index.css";
import log from 'loglevel';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

log.setLevel('debug'); // Устанавливает уровень логирования на 'debug'
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
    <DndProvider backend={HTML5Backend}>
      <Main />
                 </DndProvider>
    </Provider>
  </React.StrictMode>
);

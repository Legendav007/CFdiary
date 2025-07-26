import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { storage } from "./storageFallback.js";

const defaultValues={
  CODEFORCES_ID:  "",
  CODEFORCES_AVATAR_URL: "",
  CODEFORCES_VERIFIED: false,
  SETUP_COMPLETE: false,
  CURRENT_TAB_URL: "",
};

const initializeStorageDefaults = ()=>{
  storage.get(Object.keys(defaultValues), (result) => {
    const newValues = {};
    for(const key of Object.keys(defaultValues)){
      if(result[key] === undefined){
        newValues[key] = defaultValues[key];
      }
    }
    if(Object.keys(newValues).length > 0){
      storage.set(newValues, () => {
        console.log("Default storage values set:", newValues);
      });
    }
  });
};

initializeStorageDefaults();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
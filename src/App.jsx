import { useEffect, useState } from "react";
import StartingPage from "./Pages/StartingPage";
import { storage } from "./storageFallback.js";

const App = ()=>{
  const [setupComplete, setSetupComplete] = useState(false);

  useEffect(()=>{
    storage.get(["SETUP_COMPLETE"], (result) => {
      setSetupComplete(result.SETUP_COMPLETE || "");
    });
    const handleStorageChange = (changes, areaName) => {
      if (areaName === "local" && changes.SETUP_COMPLETE) {
        setSetupComplete(changes.SETUP_COMPLETE.newValue || "");
      }
    };
    if(typeof chrome !== "undefined" && chrome.storage && chrome.storage.onChanged) {
      chrome.storage.onChanged.addListener(handleStorageChange);
    }
    return () => {
      if(typeof chrome !== "undefined" && chrome.storage && chrome.storage.onChanged) {
        chrome.storage.onChanged.removeListener(handleStorageChange);
      }
    };
  }, []);

  return (
    <div className={`font-Averta text-primary-black bg-primary-light ${!setupComplete ? "h-[400px] w-[400px]" : "h-[300px] w-[300px]"}`}>
      <StartingPage />
    </div>
  );
};

export default App;
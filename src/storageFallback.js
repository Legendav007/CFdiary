const isChromeExtension =
  typeof chrome !== "undefined" &&
  chrome.storage &&
  chrome.storage.local;

export const storage = {
  get: (keys, callback)=>{
    if(isChromeExtension){
      try {
        chrome.storage.local.get(keys, (items) => {
          if(chrome.runtime.lastError){
            console.error(`Error accessing Chrome storage: ${chrome.runtime.lastError.message}`);
            callback({});
          }
          else{
            console.log("✔ Using Chrome storage");
            callback(items);
          }
        });
      } catch (err) {
        console.error("Chrome storage get error:", err);
        callback({});
      }
    }
    else{
        const result = {};
        keys.forEach((key)=>{
        result[key] = window[key] || undefined;
        });
        console.warn("⚠ Chrome storage not available. Using dev fallback.");
        callback(result);
    }
  },

  set: (items, callback) => {
    if(isChromeExtension){
      try{
        chrome.storage.local.set(items, () => {
            if(chrome.runtime.lastError){
            console.error(`Error writing to Chrome storage: ${chrome.runtime.lastError.message}`);
            }
            else{
            console.log("✔ Saved to Chrome storage");
            if(callback)callback();
            }
        });
      } catch(err){
        console.error("Chrome storage set error:", err);
        if (callback) callback();
      }
    }
    else{
        Object.entries(items).forEach(([key, value]) => {
            window[key] = value;
        });
        console.warn("⚠ Chrome storage not available. Saved to dev window fallback.");
        if (callback) callback();
    }
  },
};
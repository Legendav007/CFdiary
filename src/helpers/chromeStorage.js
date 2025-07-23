export function setGlobalVariablesToChromeStorage(){
    chrome.storage.local.set(
        {
            SHEETBEST_URL: window.SHEETBEST_URL,
            SHEETBEST_VERIFIED: window.SHEETBEST_VERIFIED,
            CODEFORCES_ID: window.CODEFORCES_ID,
            CODEFORCES_AVATAR_URL: window.CODEFORCES_AVATAR_URL,
            CODEFORCES_VERIFIED: window.CODEFORCES_VERIFIED,
            SETUP_COMPLETE: window.SETUP_COMPLETE,
        },
        ()=>{
            console.log("Global variables have been saved to Chrome local storage.");
        }
    );
}
  
export function getGlobalVariablesFromChromeStorage() {
    chrome.storage.local.get(
        [
            "SHEETBEST_URL",
            "SHEETBEST_VERIFIED",
            "CODEFORCES_ID",
            "CODEFORCES_AVATAR_URL",
            "CODEFORCES_VERIFIED",
            "SETUP_COMPLETE",
        ],
        (result) => {
            window.SHEETBEST_URL = result.SHEETBEST_URL || "";
            window.SHEETBEST_VERIFIED = result.SHEETBEST_VERIFIED || false;
            window.CODEFORCES_ID = result.CODEFORCES_ID || "";
            window.CODEFORCES_AVATAR_URL = result.CODEFORCES_AVATAR_URL || "";
            window.CODEFORCES_VERIFIED = result.CODEFORCES_VERIFIED || false;
            window.SETUP_COMPLETE = result.SETUP_COMPLETE || false;
        }
    );
}
  
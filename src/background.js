import { addProblems } from "./controllers/addProblem.js";
import { updateProblems } from "./controllers/updateProblem.js";

function getStorageData(keys) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(keys, (result) => {
      if(chrome.runtime.lastError){
        return reject(chrome.runtime.lastError);
      }
      resolve(result);
    });
  });
}

chrome.runtime.onInstalled.addListener(() => {
  console.log("CFDiary Extension installed.");
  chrome.tabs.query({}, function(tabs){
    for(const tab of tabs){
      if(tab.url && tab.url.match(/^https:\/\/([a-z]+\.)?codeforces\.com\//)) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['assets/content.js']
        });
      }
    }
  });  
});

chrome.action.onClicked.addListener((tab) => {
  if(tab.url && tab.url.startsWith("https://codeforces.com/")){
    chrome.tabs.sendMessage(tab.id, { action: "openModal" });
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // console.log('onUpdated called', tab.url, changeInfo);
  const urlPattern = /^https:\/\/codeforces\.com\/(?:contest\/\d+\/problem\/[A-Z]\d*|problemset\/problem\/\d+\/[A-Z]\d*)$/; 
  if(changeInfo.status === 'complete' && tab.url && tab.url.match(urlPattern)){
    console.log("Codeforces problem page detected:", tab.url);
    try {
      const problemPattern = /(?:contest\/(\d+)\/problem\/([A-Z]\d*)|problemset\/problem\/(\d+)\/([A-Z]\d*))/;
      const match = tab.url.match(problemPattern);
      // console.log(match);
      if(!match) return;
      const contestId = match[1] || match[3];
      const index = match[2] || match[4];
      const ProblemName = `${contestId}${index}`;
      console.log(ProblemName);
      const { SHEETBEST_URL } = await getStorageData(["SHEETBEST_URL"]);
      if(!SHEETBEST_URL){
        console.warn("SheetBest URL not configured. Skipping problem check.");
        return;
      }
      const fetchUrl = `${SHEETBEST_URL}/search?ProblemName=${ProblemName}`;
      const response = await fetch(fetchUrl);
      if(!response.ok){
        throw new Error(`API returned status ${response.status}`);
      }
      console.log(response);
      const data = await response.json();
      console.log(data);
      if(data && data.length > 0){
        console.log("Problem found in sheet. Sending data to prefill modal.");
        chrome.tabs.sendMessage(tabId, {
          action: "prefillModal",
          data: { status: "success", problem: data[0] }
        });
      }

    } catch (error) {
      console.error("Error checking for existing problem:", error);
    }
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const handleMessage = async () => {
    try{
      if(request.action === "submitProblem"){
        const message = await addProblems(request.data);
        sendResponse({ status: "success", result: message });
      } 
      else if(request.action === "updateProblem"){
        const message = await updateProblems(request.data);
        sendResponse({ status: "success", result: message });
      }
    } catch (error) {
      sendResponse({ status: "error", error: error.message || "An unknown error occurred." });
    }
  };

  if(request.action === "submitProblem" || request.action === "updateProblem"){
    handleMessage();
    return true;
  }
});
import { addProblems } from "./controllers/addProblem.js";
import { updateProblems } from "./controllers/updateProblem.js";

chrome.runtime.onInstalled.addListener(() => {
  console.log("CFDiary Extension installed.");
});

chrome.runtime.onMessage.addListener((message) => {
  if (message === "reload-extension") {
    chrome.runtime.reload();
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if(
    changeInfo.url &&
    tab.url.match(/^https:\/\/codeforces\.com\/(contest\/\d+\/problem\/[A-Z]|problemset\/problem\/\d+\/[A-Z])$/)
  ){
    console.log("Codeforces problem page detected:", tab.url);
    const url_split = tab.url.split("/");
    const problem = [
      url_split[url_split.length - 1],
      url_split[url_split.length - 2],
      url_split[url_split.length - 3],
    ].sort();
    const problemName = `Problem${problem[0]}${problem[1]}`;
    chrome.storage.local.get(["SHEETBEST_URL"], (result) => {
      const sheetBestUrl = result.SHEETBEST_URL;
      if (!sheetBestUrl || sheetBestUrl.trim() === "") {
        console.warn("SheetBest URL not found or is empty. Skipping check.");
        return;
      }
      const fetchUrl = `${sheetBestUrl}?problemName=${problemName}`;
      fetch(fetchUrl)
        .then((response) => response.json())
        .then((data) => {
          chrome.tabs.sendMessage(tabId, { action: "prefillModal", data });
          console.log("Problem was previously added:" + data?.status);
        })
        .catch((error) => console.error("Error checking problem:", error));
    });
  }
});

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, { action: "openModal" });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "submitProblem") {
    addProblems(request.data, (message, success) => {
      if(success){
        sendResponse({ status: "success", result: message });
      } 
      else{
        sendResponse({ status: "error", error: message });
      }
    });
    return true;
  }

  if(request.action === "updateProblem") {
    updateProblems(request.data, (message, success) => {
      if(success){
        sendResponse({ status: "success", result: message });
      }
      else {
        sendResponse({ status: "error", error: message });
      }
    });
    return true;
  }
});
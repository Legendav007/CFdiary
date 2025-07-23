import axios from "axios";
import { storage } from "../storageFallback.js";

function searchResult(result, param){
  return result.filter((item) => {
    const matchesVerdict = param.verdict ? item.verdict === param.verdict : true;
    const matchesContestId = param.contestId ? item.contestId === param.contestId : true;
    const matchesIndex = param.index ? item.problem.index === param.index : true;
    return matchesVerdict && matchesContestId && matchesIndex;
  });
}
export async function updateProblems(data, callback){
  storage.get(["SHEETBEST_URL", "CODEFORCES_ID", "CURRENT_TAB_URL"], async (result) => {
    const { SHEETBEST_URL, CODEFORCES_ID, CURRENT_TAB_URL } = result;
    if(!SHEETBEST_URL){
      callback("Sheet.best URL not found", false);
      return;
    }
    let problemSolved = false;
    try{
      const userStatus = await fetch(`https://codeforces.com/api/user.status?handle=${CODEFORCES_ID}&from=1&count=250`);
      if (!userStatus.ok) throw new Error("Failed to fetch Codeforces status");
      const userStatusData = await userStatus.json();
      if(userStatusData?.status !== "OK"){
        callback("Failed to fetch problem details from Codeforces", false);
        return;
      }
      const tabUrlSplit = CURRENT_TAB_URL.split("/");
      const len = tabUrlSplit.length;
      const arr = [tabUrlSplit[len - 1], tabUrlSplit[len - 2], tabUrlSplit[len - 3]].sort();
      const searchObj = { verdict: "OK", contestId: Number(arr[0]), index: arr[1] };
      const solvedProblem = searchResult(userStatusData.result, searchObj);
      problemSolved = solvedProblem.length > 0;
      if(!problemSolved){
        callback("Solve the problem first, then submit!", false);
        return;
      }
      const problemDetails = solvedProblem[0].problem;
      const problemRating = problemDetails.rating || "N/A";
      const problemName = `Problem${problemDetails.contestId}${problemDetails.index}`;
      const problemTopics = problemDetails.tags.join(", ");
      const date = new Date(solvedProblem[0].creationTimeSeconds * 1000);
      const dateSolved = date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).replace(/ /g, "-");

      const checkResponse = await axios.get(`${SHEETBEST_URL}?problemName=${problemName}`);
      if(!checkResponse.data || checkResponse.data.length === 0) {
        callback("Problem not found in the sheet. Please add it before updating.", false);
        return;
      }
      const patchPayload = {
        problemRating,
        problemStatus: data.status,
        remarks: data.remarks,
        dateSolved,
        timeTaken : data.timeTaken,
        takeaways: data.takeaways,
        problemTopics,
        problemUrl: CURRENT_TAB_URL,
      };
      const patchResponse = await axios.patch(`${SHEETBEST_URL}?problemName=${problemName}`, patchPayload, {
        headers: { "Content-Type": "application/json" },
      });
      if(patchResponse.status === 200){
        callback("Problem data successfully updated in your Sheet!", true);
      }
      else{
        callback("Failed to update problem data", false);
      }
    } catch (error) {
      const message = `An error occurred while updating the problem: ${error}`;
      console.error(message);
      callback(message, false);
    }
  });
}
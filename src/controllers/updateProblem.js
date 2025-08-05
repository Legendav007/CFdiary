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
function getStorage(keys){
  return new Promise(resolve => {
    storage.get(keys, resolve);
  });
}
export async function updateProblems(data){
    const{ SHEETBEST_URL, CODEFORCES_ID, CURRENT_TAB_URL } = await getStorage([
      "SHEETBEST_URL", "CODEFORCES_ID", "CURRENT_TAB_URL"
    ]);
    if(!SHEETBEST_URL){
      throw new Error("Sheet.Best URL is not found");
    }
    let problemSolved = false;
    try{
      const userStatus = await fetch(`https://codeforces.com/api/user.status?handle=${CODEFORCES_ID}&from=1&count=250`);
      if (!userStatus.ok) throw new Error("Failed to fetch Codeforces status");
      const userStatusData = await userStatus.json();
      if(userStatusData?.status !== "OK"){
        throw new Error("Error to fetch codeforce solved problem");
      }
      const problemPattern = /(?:contest\/(\d+)\/problem\/([A-Z]\d*)|problemset\/problem\/(\d+)\/([A-Z]\d*))/;
      const match = CURRENT_TAB_URL.match(problemPattern);
      // console.log(match);
      if(!match) throw new Error("Couldn't Parse problem details from url");
      const c = match[1] || match[3];
      const contestId = Number(c);
      const index = match[2] || match[4];
      const searchObj = { verdict: "OK", contestId, index };
      const solvedProblem = searchResult(userStatusData.result, searchObj);
      const problemSolved = solvedProblem.length > 0;
      if(!problemSolved){
        throw new Error("Solve the problem first , then submit!");
      }
      const problemDetails = solvedProblem[0].problem;
      const ProblemRating = problemDetails.rating || "N/A";
      const ProblemName = `=HYPERLINK("${CURRENT_TAB_URL}" , "${contestId}${index}")`;
      const ProblemTopics = problemDetails.tags.join(", ");
      const date = new Date(solvedProblem[0].creationTimeSeconds * 1000);
      const DateSolved = date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).replace(/ /g, "-");

      const checkResponse = await axios.get(`${SHEETBEST_URL}?ProblemName=${ProblemName}`);
      if(!checkResponse.data || checkResponse.data.length === 0) {
        throw new Error("Problem doesn't exist in the sheet");
      }
      const patchPayload = {
        ProblemName,
        ProblemRating,
        ProblemStatus: data.status,
        Remarks: data.remarks,
        DateSolved,
        Takeaways: data.takeaways,
        TimeTaken : data.timeTaken,
        ProblemTopics,
      };
      const patchResponse = await axios.patch(`${SHEETBEST_URL}?ProblemName=${ProblemName}`, patchPayload, {
        headers: { "Content-Type": "application/json" },
      });
      if(patchResponse.status === 200){
        return "Problem successfully updated to the sheet! 🎉";
      }
      else{
        throw new Error("Problem not upadated due to sheet.best API");
      }
    } catch (error) {
      const message = `An error occurred while updating the problem: ${error}`;
      console.error(message);
      throw new Error(message);
    }
}
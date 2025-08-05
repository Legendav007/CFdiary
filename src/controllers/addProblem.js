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
function getStorage(keys) {
  return new Promise(resolve => {
    storage.get(keys, resolve);
  });
}
export async function addProblems(data){
    const{ SHEETBEST_URL, CODEFORCES_ID, CURRENT_TAB_URL } = await getStorage([
        "SHEETBEST_URL", "CODEFORCES_ID", "CURRENT_TAB_URL"
    ]);
    if(!SHEETBEST_URL || !CODEFORCES_ID || !CURRENT_TAB_URL){
      throw new Error("Setup is incomplete.Please reconfigure");
    }
    try{
      const userStatus = await fetch(`https://codeforces.com/api/user.status?handle=${CODEFORCES_ID}&from=1&count=250`);
      if(!userStatus.ok){
        throw new Error("Failed to fetch codeforces data.API might be down");
      }
      const userData = await userStatus.json();
      if(userData.status !== "OK"){
        throw new Error(`Invalid Codeforces handle or API error: ${userData.comment}`);
      }
      const problemPattern = /(?:contest\/(\d+)\/problem\/([A-Z]\d*)|problemset\/problem\/(\d+)\/([A-Z]\d*))/;
      const match = CURRENT_TAB_URL.match(problemPattern);
      // console.log(match);
      if(!match) throw new Error("Couldn't Parse problem details from url");
      const c = match[1] || match[3];
      const contestId = Number(c);
      const index = match[2] || match[4];
      const solved = searchResult(userData.result, { verdict: "OK", contestId, index });
      if(solved.length === 0){
        throw new Error("Problem not solved or solution not found in recent submissions.");
      }
      // const prob = solved[0].problem;
      const ProblemName = `=HYPERLINK("${CURRENT_TAB_URL}" , "${prob.contestId}${prob.index}")`;
      // console.log(solved);
      // console.log(prob.rating);
      const ProblemRating = solved[0].problem.rating || "N/A";
      const ProblemTopics = solved[0].problem.tags.join(", ");
      const DateSolved = new Date(solved[0].creationTimeSeconds * 1000)
        .toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
        .replace(/ /g, "-");
      
      const existing = await axios.get(SHEETBEST_URL);
      // console.log("Searching for ProblemName:", ProblemName);
      // console.log("ProblemNames found in sheet:", existing.data.map(row => row.ProblemName));
      const alreadyExists = existing.data.some(row => row.ProblemName === ProblemName);
      if(alreadyExists){
        throw new Error("This problem already exists in your sheet.");
      }
      const payload = {
        ProblemName,
        ProblemRating,
        ProblemStatus: data.status,
        Remarks: data.remarks,
        DateSolved,
        Takeaways: data.takeaways,
        TimeTaken : data.timeTaken,
        ProblemTopics,
      };
      const response = await axios.post(SHEETBEST_URL, payload);
      if(response.status === 200){
        return "Problem successfully added to the sheet! 🎉";
      }
      else{
        throw new Error("Error in adding problem");
      }
    } catch(err){
      console.error(err);
      throw err;
    }
}
import axios from "axios";
import { getUserStatusUrl } from "./requestURL.js";
import { storage } from "../storageFallback.js";

function searchResult(result, param){
    return result.filter((item) => {
        const matchesVerdict = param.verdict ? item.verdict === param.verdict : true;
        const matchesContestId = param.contestId ? item.contestId === param.contestId : true;
        const matchesIndex = param.index ? item.problem.index === param.index : true;
        return matchesVerdict && matchesContestId && matchesIndex;
    });
}

export async function addProblems(data, callback){
  storage.get(["SHEETBEST_URL", "CODEFORCES_ID", "CURRENT_TAB_URL"], async (result) => {
    const{ SHEETBEST_URL, CODEFORCES_ID, CURRENT_TAB_URL } = result;
    if(!SHEETBEST_URL || !CODEFORCES_ID || !CURRENT_TAB_URL){
      callback("Setup incomplete. Please reconfigure.", false);
      return;
    }
    try{
      const userStatus = await fetch(`https://codeforces.com/api/user.status?handle=${CODEFORCES_ID}&from=1&count=250`);
      if(!userStatus.ok){
        callback("Failed to fetch Codeforces data", false);
        return;
      }
      const userData = await userStatus.json();
      if(userData.status !== "OK"){
        callback("Invalid Codeforces handle", false);
        return;
      }
      const parts = CURRENT_TAB_URL.split("/");
      const len = parts.length;
      const arr = [parts[len - 1], parts[len - 2], parts[len - 3]];
      arr.sort();
      const [contestId, index] = [Number(arr[0]), arr[1]];
      const solved = searchResult(userData.result, { verdict: "OK", contestId, index });
      if(solved.length === 0){
        callback("Please solve the problem before submitting.", false);
        return;
      }
      const prob = solved[0].problem;
      const problemName = `Problem${prob.contestId}${prob.index}`;
      const problemRating = prob.rating || "N/A";
      const problemTopics = prob.tags.join(", ");
      const dateSolved = new Date(solved[0].creationTimeSeconds * 1000)
        .toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
        .replace(/ /g, "-");

      const existing = await axios.get(SHEETBEST_URL);
      const alreadyExists = existing.data.some(row => row.problemName === problemName);
      if(alreadyExists){
        callback("This problem already exists in your sheet.", false);
        return;
      }
      const payload = {
        problemName,
        problemRating,
        problemStatus: data.status,
        remarks: data.remarks,
        dateSolved,
        takeaways: data.takeaways,
        timeTaken : data.timeTaken,
        problemTopics,
        problemUrl: CURRENT_TAB_URL,
      };
      const response = await axios.post(SHEETBEST_URL, payload);
      if(response.status === 200){
        callback("Problem successfully added to the sheet!", true);
      }
      else{
        callback("Failed to add problem. Try again.", false);
      }
    } catch (err) {
      console.error(err);
      callback("Error occurred while submitting the problem.", false);
    }
  });
}
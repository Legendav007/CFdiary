export const checkCodeforcesUrl = (url) => {
    if (!url || typeof url !== "string") return false
    const codeforcesUrlPattern = /^https:\/\/codeforces\.com\/profile\/[a-zA-Z0-9_-]+$/
    return codeforcesUrlPattern.test(url.trim())
  }
export const checkSheetBestUrl = (url) => {
    if (!url || typeof url !== "string") return false
    const sheetBestUrlPattern = /^https:\/\/api\.sheetbest\.com\/sheets\/[a-zA-Z0-9_-]+$/
    return sheetBestUrlPattern.test(url.trim())
}  
export const checkCodeforcesSite = (url, setError)=>{
    if(!url.includes("https://codeforces.com/")){
        setError("Extension works only with Codeforces!");
        return false;
    }
    if(!url.includes("/problem/")){
        setError("Open a specific problem page on Codeforces.");
        return false;
    }
    return true;
};
  
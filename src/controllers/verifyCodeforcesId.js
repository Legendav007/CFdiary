import { storage } from "../storageFallback.js";

const handleVerifyCodeforcesId = async (
  codeforcesId,
  setError,
  setPageNumber,
  setLoading,
  closeModal
)=>{
  storage.get(["CODEFORCES_VERIFIED", "CODEFORCES_ID", "CODEFORCES_AVATAR_URL"], async (result)=>{
    const { CODEFORCES_VERIFIED } = result;
    if(CODEFORCES_VERIFIED){
      if(setPageNumber) setPageNumber(3);
      return;
    }
    setLoading(true);
    
    const userId = codeforcesId.substring(31); 

    try{
      const response = await fetch(`https://codeforces.com/api/user.info?handles=${userId}`);
      if(response.ok){
        const data = await response.json();
        if(data?.status === "OK"){
          const avatar = data.result[0].avatar;
          storage.set(
            {
              CODEFORCES_VERIFIED: true,
              CODEFORCES_ID: userId,
              CODEFORCES_AVATAR_URL: avatar,
            },
            () => {
              window.CODEFORCES_VERIFIED = true;
              window.CODEFORCES_ID = userId;
              window.CODEFORCES_AVATAR_URL = avatar;
            }
          );
          setLoading(false);
          if (setPageNumber) setPageNumber(3);
        }
        else{
          setError("❌ Error! Try Again: " + data?.comment);
          setLoading(false);
        }
      }
      else{
        setError("❌ Failed to fetch Codeforces data!");
        setLoading(false);
      }
      if(closeModal) closeModal();
    } catch (error) {
      console.error("🚨 Fetch error:", error);
      setError("❌ Error fetching Codeforces data");
      setLoading(false);
      if (closeModal) closeModal();
    }
  });
};

export { handleVerifyCodeforcesId };
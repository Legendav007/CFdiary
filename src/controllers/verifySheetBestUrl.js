import axios from "axios";
import { storage } from "../storageFallback.js";


export const handleVerifySheetBestUrl = async(
  sheetBestUrl,
  setError,
  setPageNumber,
  setLoading,
  closeModal
)=>{
  storage.get(["SHEETBEST_URL", "SHEETBEST_VERIFIED", "SETUP_COMPLETE"], async (result) => {
    const{ SHEETBEST_VERIFIED } = result;
    if(SHEETBEST_VERIFIED){
      if(setPageNumber) setPageNumber(4);
      return;
    }
    setLoading(true);
    try {
        storage.set({ SHEETBEST_URL: sheetBestUrl }, () => {
            window.SHEETBEST_URL = sheetBestUrl;
        });

        const response = await axios.get(sheetBestUrl);

        if (response.status === 200 && Array.isArray(response.data)) {
        storage.set(
          {
            SHEETBEST_VERIFIED: true,
            SETUP_COMPLETE: true,
          },
          () => {
            window.SHEETBEST_VERIFIED = true;
            window.SETUP_COMPLETE = true;
          }
        );
        setLoading(false);
        if(setPageNumber)setPageNumber(4);
            console.log("✔ Sheet.best URL verified successfully.");
        }
        else{
            setError("Invalid Sheet.best response.");
            console.error("Unexpected response from Sheet.best:", response.data);
        }
        if(closeModal) closeModal();
    } catch (error) {
      setLoading(false);
      setError("Error verifying Sheet.best URL.");
      if(closeModal) closeModal();
      console.error("❌ Sheet.best verification failed:", error);
    }
  });
};

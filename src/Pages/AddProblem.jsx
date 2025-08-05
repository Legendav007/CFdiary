import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, AlertCircle, ExternalLink, CheckCircle } from "lucide-react"
import { checkCodeforcesSite } from "../helpers/utility.js"
import { storage } from "../storageFallback.js"
import Footer from "@/components/ui/footer.jsx"
const AddProblems = () => {
  const [currentUrl, setCurrentUrl] = useState("")
  const [error, setError] = useState("noerror")
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const initializeTab = async () => {
      setIsLoading(true);

      if(typeof chrome !== "undefined" && chrome.tabs){
        try {
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if(tabs[0]?.url){
              const url = tabs[0].url;
              setCurrentUrl(url);
              storage.set({ CURRENT_TAB_URL: url }, () => {
                window.CURRENT_TAB_URL = url;
              })
              const isValid = checkCodeforcesSite(url, setError);
              setIsButtonDisabled(!isValid);
            }
            setIsLoading(false);
          })
        } catch(err){
          console.error("Error accessing chrome tabs:", err);
          setError("Failed to access browser tab information");
          setIsLoading(false);
        }
      }
      else{
        console.warn("Chrome tabs API is not available.");
        setError("Chrome extension API not available");
        setIsLoading(false);
      }
    }
    initializeTab()
  }, [])

  const openModalOnPage = async () => {
    // console.log("I am here on fn-model-on-page");
    if(typeof chrome !== "undefined" && chrome.tabs){
      setIsProcessing(true)
      try{
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]?.id) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "openModal" });
          }
          setIsProcessing(false);
        })
      } catch(err){
        console.error("Error sending message to tab:", err);
        setError("Failed to communicate with the page");
        setIsProcessing(false);
      }
    }
  }

  const getUrlDisplay = (url) => {
    try{
      const urlObj = new URL(url);
      return urlObj.hostname + urlObj.pathname;
    } catch {
      return url;
    }
  }

  const getButtonContent = () => {
    if (isProcessing) {
      return (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Processing...
        </>
      )
    }

    if(error !== "noerror"){
      return (
        <>
          <AlertCircle className="w-4 h-4 mr-2" />
          Cannot Add Problem
        </>
      )
    }
    return (
      <>
        <Plus className="w-4 h-4 mr-2" />
        Add This Problem
      </>
    )
  }
  const getButtonVariant = () => {
    if(error !== "noerror") return "destructive";
    if(isButtonDisabled) return "secondary";
    return "default";
  }
  if(isLoading){
    return (
      <div className="w-full max-w-md mx-auto space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">CF Diary</h1>
          <p className="text-sm text-muted-foreground">Codeforces Problem Tracker</p>
        </div>

        <Card className="w-full">
          <CardContent className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Checking current page...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">CF Diary</h1>
        <p className="text-sm text-muted-foreground">Codeforces Problem Tracker</p>
      </div>

      <Card className="w-full">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ExternalLink className="w-5 h-5" />
            Add Codeforces Problem
          </CardTitle>
          <CardDescription>Add the current problem to your collection</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Current URL Display */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Current Page:</label>
            <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
              <a href={currentUrl?currentUrl:"https://codeforces.com"} target="_blank" rel="noopener noreferrer" aria-label="Open external link">
                <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </a>
              {/* <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" /> */}
              <span className="text-sm truncate" title={currentUrl}>
                {currentUrl ? getUrlDisplay(currentUrl) : "No URL detected"}
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            {error === "noerror" ? (
              <Badge variant="default" className="gap-1">
                <CheckCircle className="w-3 h-3" />
                Valid Codeforces Problem
              </Badge>
            ) : (
              <Badge variant="destructive" className="gap-1">
                <AlertCircle className="w-3 h-3" />
                Invalid Page
              </Badge>
            )}
          </div>

          <Button
            onClick={openModalOnPage}
            disabled={isButtonDisabled}
            variant={getButtonVariant()}
            className="w-full"
            size="lg"
          >
            {getButtonContent()}
          </Button>

          {/* Error Display */}
          {error !== "noerror" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>Error:</strong> {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Help Text */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Navigate to a Codeforces problem page to add it to your collection
            </p>
          </div>
          <Footer/>
        </CardContent>
      </Card>
    </div>
  )
}

export default AddProblems;

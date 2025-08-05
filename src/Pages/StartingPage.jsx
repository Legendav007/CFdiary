import { useEffect, useState } from "react"
import { Button as UIButton } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, ChevronRight, CheckCircle, BookOpen, User, Database, Loader2 } from "lucide-react"
import WelcomePage from "./WelcomePage"
import SheetBestForm from "./SheetBestForm"
import CodeforcesForm from "./CodeforcesForm"
import { handleVerifyCodeforcesId } from "../controllers/verifyCodeforcesId.js"
import { handleVerifySheetBestUrl } from "../controllers/verifySheetBestUrl.js"
import AddProblems from "./AddProblem"
import SettingsMenu from "./Setting"
import { storage } from "../storageFallback.js"
import { checkSheetBestUrl, checkCodeforcesUrl } from "../helpers/utility.js"
import Footer from "@/components/ui/footer"
const steps = [
  {
    id: 1,
    title: "Welcome",
    description: "Get started with CF Diary",
    icon: BookOpen,
  },
  {
    id: 2,
    title: "Codeforces Profile",
    description: "Connect your Codeforces account",
    icon: User,
  },
  {
    id: 3,
    title: "Data Storage",
    description: "Configure your data storage",
    icon: Database,
  },
]

// Step indicator
const StepIndicator = ({ currentStep, steps }) => {
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="flex justify-between items-center mb-4">
        {steps.map((step) => {
          const StepIcon = step.icon
          const isActive = currentStep === step.id
          const isCompleted = currentStep > step.id

          return (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                  ${
                    isCompleted
                      ? "bg-green-500 border-green-500 text-white"
                      : isActive
                      ? "bg-blue-500 border-blue-500 text-white"
                      : "bg-background border-muted-foreground/30 text-muted-foreground"
                  }
                `}
              >
                {isCompleted ? <CheckCircle className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
              </div>
              <div className="mt-2 text-center">
                <p className={`text-xs font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                  {step.title}
                </p>
              </div>
            </div>
          )
        })}
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  )
}

// Main Page
const StartingPage = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [sheetBestUrl, setSheetBestUrl] = useState("https://sheet.best/api/sheets/your-endpoint-id");
  const [codeforcesId, setCodeforcesId] = useState("https://codeforces.com/profile/user__Id");
  const [correctCodeforcesId, setCorrectCodeforcesId] = useState(false);
  const [correctSheetBestUrl, setCorrectSheetBestUrl] = useState(false);
  const [error, setError] = useState("NoError");
  const [isLoading, setLoading] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);

  useEffect(() => {
    storage.get(["SETUP_COMPLETE"], (result) => {
      setSetupComplete(result.SETUP_COMPLETE || false);
    })

    const handleStorageChange = (changes, areaName) => {
      if(areaName === "local" && changes.SETUP_COMPLETE){
        setSetupComplete(changes.SETUP_COMPLETE.newValue || false);
      }
    }

    if(typeof chrome !== "undefined" && chrome.storage?.onChanged){
      chrome.storage.onChanged.addListener(handleStorageChange);
    }

    return () => {
      if(typeof chrome !== "undefined" && chrome.storage?.onChanged){
        chrome.storage.onChanged.removeListener(handleStorageChange);
      }
    }
  }, [])

  useEffect(() => {
    setCorrectCodeforcesId(checkCodeforcesUrl(codeforcesId));
  }, [codeforcesId])

  useEffect(() => {
    setCorrectSheetBestUrl(checkSheetBestUrl(sheetBestUrl));
  }, [sheetBestUrl])

  const handleTryAgainCodeforcesForm = () => {
    setCodeforcesId("https://codeforces.com/profile/user__Id");
    setError("NoError");
  }

  const handleTryAgainSheetBestForm = () => {
    setSheetBestUrl("https://sheet.best/api/sheets/your-endpoint-id");
    setError("NoError");
  }

  const getCurrentStepInfo = () => {
    return steps.find((step) => step.id === pageNumber) || steps[0];
  }

  const canProceed = () => {
    if (pageNumber === 2) return correctCodeforcesId;
    if (pageNumber === 3) return correctSheetBestUrl;
    return true;
  }

  if(setupComplete){
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">CF Diary</h1>
            </div>
            <SettingsMenu
              codeforcesId={codeforcesId}
              setCodeforcesId={setCodeforcesId}
              error={error}
              setError={setError}
              isLoading={isLoading}
              setLoading={setLoading}
              handleTryAgainCodeforcesForm={handleTryAgainCodeforcesForm}
              appScriptUrl={sheetBestUrl}
              setAppScriptUrl={setSheetBestUrl}
              handleTryAgainAppScriptForm={handleTryAgainSheetBestForm}
            />
          </div>
          <AddProblems />
        </div>
      </div>
    )
  }

  return(
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">CF Diary</h1>
          </div>
          <p className="text-gray-600">Your Codeforces problem-solving companion</p>
        </div>

        <StepIndicator currentStep={pageNumber} steps={steps} />

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                Step {pageNumber} of {steps.length}
              </Badge>
            </div>
            <CardTitle className="text-lg">{getCurrentStepInfo().title}</CardTitle>
            <CardDescription>{getCurrentStepInfo().description}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="min-h-[280px] flex flex-col justify-center">
              {pageNumber === 1 && <WelcomePage />}
              {pageNumber === 2 && (
                <CodeforcesForm
                  codeforcesId={codeforcesId}
                  setCodeforcesId={setCodeforcesId}
                  error={error}
                  isLoading={isLoading}
                  onTryAgain={handleTryAgainCodeforcesForm}
                />
              )}
              {pageNumber === 3 && (
                <SheetBestForm
                  url={sheetBestUrl}
                  setUrl={setSheetBestUrl}
                  error={error}
                  isLoading={isLoading}
                  onTryAgain={handleTryAgainSheetBestForm}
                />
              )}
            </div>

            {error === "NoError" && (
              <>
                <Separator />
                <div className="flex items-center justify-between gap-4">
                  {pageNumber !== 1 ? (
                    <UIButton
                      variant="outline"
                      onClick={() => setPageNumber((prev) => prev - 1)}
                      className="flex items-center gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </UIButton>
                  ) : (
                    <div />
                  )}

                  {pageNumber === 1 ? (
                    <UIButton onClick={() => setPageNumber((prev) => prev + 1)} className="flex items-center gap-2 ml-auto">
                      Get Started
                      <ChevronRight className="w-4 h-4" />
                    </UIButton>
                  ) : pageNumber === 2 ? (
                    <UIButton
                      disabled={!canProceed() || isLoading}
                      onClick={() =>
                        handleVerifyCodeforcesId(codeforcesId, setError, setPageNumber, setLoading, undefined)
                      }
                      className="flex items-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          Continue
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </UIButton>
                  ) : (
                    <UIButton
                      disabled={!canProceed() || isLoading}
                      onClick={() =>
                        handleVerifySheetBestUrl(sheetBestUrl, setError, setPageNumber, setLoading, undefined)
                      }
                      className="flex items-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Setting up...
                        </>
                      ) : (
                        <>
                          Complete Setup
                          <CheckCircle className="w-4 h-4" />
                        </>
                      )}
                    </UIButton>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">Secure setup • Your data stays private</p>
        </div>
      </div>
    </div>
  )
}

export default StartingPage;


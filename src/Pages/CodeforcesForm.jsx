import React, { useState } from "react"
import { User, ExternalLink, CheckCircle, AlertCircle, Globe } from "lucide-react"
import { checkCodeforcesUrl } from "../helpers/utility.js"
import Loader from "../components/ui/atoms/loader"
import Alert from "../components/ui/atoms/alert"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

function CodeforcesForm({ codeforcesId, setCodeforcesId, error, isLoading, onTryAgain }) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const isValid = checkCodeforcesUrl(codeforcesId);
  const showValidation = hasInteracted && codeforcesId && codeforcesId.length > 0;

  const handleInputChange = (e) => {
    setCodeforcesId(e.target.value);
    if(!hasInteracted)setHasInteracted(true);
  }
  const extractUsername = (url) => {
    if(typeof url !== "string") return "";
    const match = url.match(/\/profile\/([a-zA-Z0-9_-]+)$/);
    return match ? match[1] : "";
  }

  const username = extractUsername(codeforcesId);

  if(isLoading){
    return(
      <div className="flex justify-center items-center min-h-[300px]">
        <Card className="w-[355px] bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-8">
            <Loader size="lg">
              <span className="text-blue-700">Verifying your Codeforces profile...</span>
            </Loader>
          </CardContent>
        </Card>
      </div>
    )
  }

  if(error && !error?.includes("NoError")){
    return(
      <div className="flex justify-center items-center min-h-[300px]">
        <Alert title={error} description="Please try again!" onTryAgain={onTryAgain} />
      </div>
    )
  }
  return (
    <div className="flex justify-center items-center min-h-[300px] p-4">
      <Card className="w-full max-w-md bg-white shadow-xl border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Connect Your Profile</h2>
              <p className="text-blue-100 text-sm">Enter your Codeforces profile URL</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Input Section */}
          <div className="space-y-3">
            <label htmlFor="codeforcesId" className="block text-sm font-semibold text-gray-800">
              Codeforces Profile URL
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Globe className="h-5 w-5 text-gray-400" />
              </div>

              <input
                id="codeforcesId"
                type="url"
                value={codeforcesId}
                onChange={handleInputChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`
                  w-full pl-10 pr-10 py-3 rounded-lg border-2 transition-all duration-200
                  bg-gray-50 text-gray-900 placeholder-gray-500
                  focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                  ${showValidation ? (isValid ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50") : "border-gray-200"}
                `}
                placeholder="https://codeforces.com/profile/your_username"
                minLength={31}
              />
              {showValidation && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {isValid ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              )}
            </div>
            {/* Validation Messages */}
            {showValidation && (
              <div className="space-y-2">
                {isValid ? (
                  <div className="flex items-center space-x-2 text-green-700 bg-green-50 p-3 rounded-lg">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Valid profile URL!</p>
                      {username && <p className="text-xs text-green-600">Username: {username}</p>}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start space-x-2 text-red-700 bg-red-50 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Invalid URL format</p>
                      <p className="text-xs text-red-600 mt-1">Please enter a valid Codeforces profile URL</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Help Section */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">How to find your profile URL:</h4>
            <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
              <li>
                Go to <span className="font-mono bg-blue-100 px-1 rounded">codeforces.com</span>
              </li>
              <li>Click on your username in the top right</li>
              <li>Copy the URL from your browser's address bar</li>
            </ol>
          </div>
          {/* Preview Section */}
          {isValid && username && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">Ready to connect:</p>
                  <p className="text-lg font-bold text-blue-600">{username}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="border-blue-300 text-blue-700 hover:bg-blue-100 bg-transparent"
                >
                  <a href={codeforcesId} target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
                    View Profile
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default CodeforcesForm;

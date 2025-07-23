import React, { useState } from "react"
import { Database, ExternalLink, CheckCircle, AlertCircle, Link, FileSpreadsheet } from "lucide-react"
import { checkSheetBestUrl } from "../helpers/utility.js"
import Loader from "../components/ui/atoms/loader"
import Alert from "../components/ui/atoms/alert"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const SheetBestForm = ({ url, setUrl, error, isLoading, onTryAgain }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const isValid = checkSheetBestUrl(url);
  const showValidation = hasInteracted && url.length > 0;

  const handleInputChange = (e) => {
    setUrl(e.target.value);
    if (!hasInteracted) setHasInteracted(true);
  }
  const extractSheetId = (url) => {
    if (typeof url !== "string") return "";
    const match = url.match(/\/sheets\/([a-zA-Z0-9_-]+)$/);
    return match ? match[1] : "";
  }

  const sheetId = extractSheetId(url);

  if(isLoading){
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Card className="w-[355px] bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-8">
            <Loader size="lg">
              <span className="text-green-700">Verifying your Sheet.best API...</span>
            </Loader>
          </CardContent>
        </Card>
      </div>
    )
  }

  if(error && !error?.includes("NoError")){
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Alert
          title="API NOT FOUND!"
          description="Please check your Sheet.best URL and try again!"
          onTryAgain={onTryAgain}
        />
      </div>
    )
  }
  return(
    <div className="flex justify-center items-center min-h-[300px] p-4">
      <Card className="w-full max-w-md bg-white shadow-xl border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Connect Your Sheet</h2>
              <p className="text-green-100 text-sm">Enter your Sheet.best API URL</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="space-y-3">
            <label htmlFor="sheetBestUrl" className="block text-sm font-semibold text-gray-800">
              Sheet.best API URL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Link className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="sheetBestUrl"
                type="url"
                value={url}
                onChange={handleInputChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`
                  w-full pl-10 pr-10 py-3 rounded-lg border-2 transition-all duration-200
                  bg-gray-50 text-gray-900 placeholder-gray-500
                  focus:outline-none focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200
                  ${showValidation ? (isValid ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50") : "border-gray-200"}
                `}
                placeholder="https://api.sheetbest.com/sheets/your_sheet_id"
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
            {showValidation && (
              <div className="space-y-2">
                {isValid ? (
                  <div className="flex items-center space-x-2 text-green-700 bg-green-50 p-3 rounded-lg">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Valid API URL!</p>
                      {sheetId && <p className="text-xs text-green-600">Sheet ID: {sheetId}</p>}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start space-x-2 text-red-700 bg-red-50 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Invalid API URL format</p>
                      <p className="text-xs text-red-600 mt-1">
                        Please enter a valid SheetBest API URL (https://api.sheetbest.com/sheets/...)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="text-sm font-semibold text-green-800 mb-2 flex items-center">
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              How to get your Sheet.best API URL:
            </h4>
            <ol className="text-xs text-green-700 space-y-1 list-decimal list-inside">
              <li>Create a Google Sheet with your data</li>
              <li>Go to <span className="font-mono bg-green-100 px-1 rounded">sheetbest.com</span></li>
              <li>Connect your Google Sheet and get your API URL</li>
              <li>Copy the API URL (format: api.sheetbest.com/sheets/...)</li>
            </ol>
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="border-green-300 text-green-700 hover:bg-green-100 bg-transparent"
              >
                <a href="https://sheet.best" target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
                  Visit Sheet.best
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </Button>
            </div>
          </div>

          {isValid && sheetId && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">Ready to connect:</p>
                  <p className="text-lg font-bold text-green-600 font-mono">{sheetId}</p>
                </div>
                <div className="flex items-center text-green-600">
                  <Database className="w-5 h-5 mr-1" />
                  <span className="text-sm font-medium">Connected</span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">Required Google Sheet columns:</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Problem Name
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Difficulty
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Time Taken
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Notes
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SheetBestForm;
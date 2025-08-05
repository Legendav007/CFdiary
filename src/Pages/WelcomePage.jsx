import { ExternalLink, BookOpen, Trophy, Code, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import  Footer   from "@/components/ui/footer"

const WelcomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex justify-center items-center p-4">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-2xl border-0 overflow-hidden">
        <CardContent className="p-0">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="bg-white/20 p-3 rounded-full">
                <Trophy className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome to CF Diary 🚀</h1>
            <p className="text-blue-100 text-sm leading-relaxed">
              Your personal journal for tracking Codeforces problems — time, takeaways, and more.
            </p>
          </div>

          {/* Content Section */}
          <div className="p-6 space-y-6">
            {/* Getting Started Steps */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Zap className="w-5 h-5 text-blue-600 mr-2" />
                Quick Setup
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Enter your Codeforces handle</p>
                    <p className="text-xs text-gray-600 mt-1">Connect your CF profile to start tracking</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Create & link Google Sheet</p>
                    <div className="flex items-center mt-1">
                      <p className="text-xs text-gray-600 mr-1">via</p>
                      <a
                        href="https://sheet.best"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium inline-flex items-center transition-colors"
                      >
                        sheet.best
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <div className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Start logging problems</p>
                    <p className="text-xs text-gray-600 mt-1">Track your progress with one click</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Preview */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                <Code className="w-4 h-4 text-indigo-600 mr-2" />
                What you'll track
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Problem difficulty
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Time taken
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  Key takeaways
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                  Solution notes
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="text-center pt-2 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">Need help getting started?</p>
              <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
                <a
                  href="https://github.com/Legendav007/CFDiary"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Read Documentation
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          </div>
          {/* About me section */}
          <Footer/>
        </CardContent>
      </Card>
    </div>
  )
}

export default WelcomePage

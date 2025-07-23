import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
const Alert = ({ title, description, onTryAgain }) => {
  return (
    <Card className="w-[355px] border-red-200 bg-red-50">
      <CardContent className="p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-3 rounded-full">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">{title}</h3>
        <p className="text-sm text-red-600 mb-4">{description}</p>
        <Button
          onClick={onTryAgain}
          variant="outline"
          className="border-red-300 text-red-700 hover:bg-red-100 bg-transparent"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </CardContent>
    </Card>
  )
}

export default Alert

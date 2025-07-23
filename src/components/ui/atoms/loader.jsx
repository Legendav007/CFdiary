import { Loader2 } from "lucide-react"
const Loader = ({ children, size = "md" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />
      {children && <p className="text-sm text-gray-600 font-medium">{children}</p>}
    </div>
  )
}

export default Loader

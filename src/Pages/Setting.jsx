import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Settings, User, Database, Check, AlertCircle, Loader2, ExternalLink } from "lucide-react"
import CodeforcesForm from "./CodeforcesForm.jsx"
import SheetBestForm from "./SheetBestForm.jsx"
import { handleVerifyCodeforcesId } from "../controllers/verifyCodeforcesId.js"
import { handleVerifySheetBestUrl } from "../controllers/verifySheetBestUrl.js"
import { storage } from "../storageFallback.js"

const SettingsMenu = ({
  codeforcesId,
  setCodeforcesId,
  error,
  isLoading,
  setError,
  setLoading,
  sheetBestUrl,
  setSheetBestUrl,
  handleTryAgainCodeforcesForm,
  handleTryAgainSheetBestForm,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [changeUrl, setChangeUrl] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [codeforcesVerified, setCodeforcesVerified] = useState(false);
  const [sheetBestVerified, setSheetBestVerified] = useState(false);
  const [username, setUsername] = useState("");

  const closeModal = () => {
    setIsModalOpen(false);
    setChangeUrl("");
  }

  const handleSubmit = () => {
    if(changeUrl === "codeforcesid"){
      storage.set({ CODEFORCES_VERIFIED: false }, () => {
        handleVerifyCodeforcesId(codeforcesId, setError, undefined, setLoading, closeModal);
        if(error){
          storage.set({ CODEFORCES_VERIFIED: true });
        }
      })
    }
    if(changeUrl === "sheetbesturl"){
      storage.set({ SHEETBEST_VERIFIED: false }, () => {
        handleVerifySheetBestUrl(sheetBestUrl, setError, undefined, setLoading, closeModal);
        if(error){
          storage.set({ SHEETBEST_VERIFIED: true });
        }
      })
    }
  }

  useEffect(() => {
    storage.get(
      ["CODEFORCES_AVATAR_URL", "CODEFORCES_VERIFIED", "SHEETBEST_VERIFIED", "CODEFORCES_USERNAME"],
      (result) => {
        setAvatarUrl(result.CODEFORCES_AVATAR_URL || "");
        setCodeforcesVerified(result.CODEFORCES_VERIFIED || false);
        setSheetBestVerified(result.SHEETBEST_VERIFIED || false);
        setUsername(result.CODEFORCES_USERNAME || "");
      },
    )

    const handleStorageChange = (changes, areaName) => {
      if(areaName === "local"){
        if(changes.CODEFORCES_AVATAR_URL){
          setAvatarUrl(changes.CODEFORCES_AVATAR_URL.newValue || "");
        }
        if(changes.CODEFORCES_VERIFIED){
          setCodeforcesVerified(changes.CODEFORCES_VERIFIED.newValue || false);
        }
        if(changes.SHEETBEST_VERIFIED){
          setSheetBestVerified(changes.SHEETBEST_VERIFIED.newValue || false);
        }
        if(changes.CODEFORCES_USERNAME){
          setUsername(changes.CODEFORCES_USERNAME.newValue || "");
        }
      }
    }

    if(typeof window !== "undefined" && window.chrome && window.chrome.storage && window.chrome.storage.onChanged){
      window.chrome.storage.onChanged.addListener(handleStorageChange);
    }

    return () => {
      if(typeof window !== "undefined" && window.chrome && window.chrome.storage && window.chrome.storage.onChanged){
        window.chrome.storage.onChanged.removeListener(handleStorageChange);
      }
    }
  }, [])

  const getInitials = (name) => {
    if (!name) return "CF"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getModalTitle = () => {
    switch (changeUrl) {
      case "codeforcesid":
        return "Update Codeforces Profile";
      case "sheetbesturl":
        return "Update Data Storage";
      default:
        return "Settings";
    }
  }

  const getModalDescription = () => {
    switch (changeUrl) {
      case "codeforcesid":
        return "Change your connected Codeforces profile to track different problems.";
      case "sheetbesturl":
        return "Update your data storage configuration to change where your problem data is saved.";
      default:
        return "";
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:bg-gray-100">
            <Avatar className="h-10 w-10 border-2 border-white shadow-md">
              <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={username || "User"} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                {getInitials(username)}
              </AvatarFallback>
            </Avatar>
            {isLoading && (
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-blue-500 rounded-full flex items-center justify-center">
                <Loader2 className="h-2.5 w-2.5 text-white animate-spin" />
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-72 p-2" align="end" forceMount>
          {/* User Info Section */}
          <DropdownMenuLabel className="font-normal p-3">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={username || "User"} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                  {getInitials(username)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{username || "CF Diary User"}</p>
                <p className="text-xs leading-none text-muted-foreground">Manage your settings</p>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {/* Settings Section */}
          <div className="p-1">
            <div className="text-xs font-medium text-muted-foreground mb-2 px-2">Configuration</div>

            <DropdownMenuItem
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 rounded-md"
              onClick={() => {
                setChangeUrl("codeforcesid")
                setIsModalOpen(true)
              }}
            >
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-blue-100 rounded-md flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Codeforces Profile</span>
                  <span className="text-xs text-muted-foreground">Update your profile connection</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {codeforcesVerified ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                    <Check className="h-3 w-3 mr-1" />
                    Connected
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Not Connected
                  </Badge>
                )}
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 rounded-md"
              onClick={() => {
                setChangeUrl("sheetbesturl")
                setIsModalOpen(true)
              }}
            >
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-green-100 rounded-md flex items-center justify-center">
                  <Database className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Data Storage</span>
                  <span className="text-xs text-muted-foreground">Configure your data endpoint</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {sheetBestVerified ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                    <Check className="h-3 w-3 mr-1" />
                    Connected
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Not Connected
                  </Badge>
                )}
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </div>
            </DropdownMenuItem>
          </div>

          <DropdownMenuSeparator />

          {/* Status Section */}
          <div className="p-3">
            <div className="text-xs font-medium text-muted-foreground mb-2">System Status</div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Extension Status</span>
              <div className="flex items-center space-x-1">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-green-600 font-medium">Active</span>
              </div>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Settings Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg max-w-[95vw] max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {getModalTitle()}
            </DialogTitle>
            <DialogDescription>{getModalDescription()}</DialogDescription>
          </DialogHeader>

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto py-4 px-1">
            <div className="space-y-4">
              {changeUrl === "codeforcesid" && (
                <CodeforcesForm
                  codeforcesId={codeforcesId}
                  setCodeforcesId={setCodeforcesId}
                  error={error}
                  isLoading={isLoading}
                  onTryAgain={handleTryAgainCodeforcesForm}
                />
              )}
              {changeUrl === "sheetbesturl" && (
                <SheetBestForm
                  url={sheetBestUrl}
                  setUrl={setSheetBestUrl}
                  error={error}
                  isLoading={isLoading}
                  onTryAgain={handleTryAgainSheetBestForm}
                />
              )}
            </div>
          </div>

          {/* Fixed action buttons at bottom */}
          <div className="flex-shrink-0 flex justify-end gap-3 pt-4 border-t bg-background">
            <Button variant="outline" onClick={closeModal} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default SettingsMenu

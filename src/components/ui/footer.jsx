import { Heart } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#4169e1]/60 py-6 text-white text-center text-sm mt-8">
      <div className="inline-flex items-center gap-2 mb-2">
        <span>Made with</span>
        <Heart width={20} height={20} fill="white" className="mx-1"/>
        <a
          href="https://codeforces.com/profile/legendav007"
          target="_blank"
          className="font-bold text-cyan-500 hover:underline"
        >
          legendav007
        </a>
      </div>
      <div>© {new Date().getFullYear()} CFDiary! All rights reserved.</div>
    </footer>
  )
}

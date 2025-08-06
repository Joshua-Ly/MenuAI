import Link from "next/link"
import { MdRestaurantMenu } from "react-icons/md"
import { FaGithub, FaLinkedin } from "react-icons/fa"

export function Header() {
  return (
    <header className="bg-[#001f3f] border-b border-gray-700">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* logo */}
        <Link href="/" className="flex items-center space-x-2">
          <MdRestaurantMenu className="h-8 w-8 text-white" />
          <span className="text-2xl font-bold text-white">MenuAI</span>
        </Link>

        {/* action buttons */}
        <div className="flex items-center space-x-4">
          {/* GitHub star */}
          <a
            href="https://github.com/Joshua-Ly"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 rounded-full border border-white bg-transparent px-4 py-2 text-sm text-white shadow-md transition-colors hover:bg-white hover:text-[#001f3f]"
          >
            <FaGithub className="h-5 w-5" />
            <span>Star on GitHub</span>
          </a>

          {/* LinkedIn icon link */}
          <a
            href="https://www.linkedin.com/in/your-profile"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white rounded border border-white transition-colors hover:bg-white hover:text-[#001f3f]"
          >
            <FaLinkedin className="h-8 w-8" />
            <span className="sr-only">LinkedIn</span>
          </a>
        </div>
      </div>
    </header>
  )
}

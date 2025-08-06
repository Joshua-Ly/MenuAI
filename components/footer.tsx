export function Footer() {
  return (
    <footer className="bg-[#001f3f] border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <p className="text-white text-center">
          Created by{" "}
          <a
            href="https://github.com/Joshua-Ly"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-blue-500 transition-colors"
          >
            Joshua Ly
          </a>
          . Powered by{" "}
          <a
            href="https://togetherai.link/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold underline underline-offset-4 hover:text-blue-500 transition-colors"
          >
            TogetherAI.
          </a>
        </p>
      </div>
    </footer>
  );
}

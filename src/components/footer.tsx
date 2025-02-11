import Image from "next/image"
import Link from "next/link"
import img from "../../Speakify.png"
export default function Footer() {
  return (
    <footer className="bg-black text-white py-8">
      <div className="container mx-auto flex flex-col px-10 md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <Image src={img} alt="Translation Logo" width={50} height={50} />
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/about" className="hover:text-[#5e17eb] yo">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#5e17eb] yo">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-[#5e17eb] yo">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </nav>
        <div className="mt-4 md:mt-0">
          <Link href="https://twitter.com/yourusername" className="text-[#5e17eb] yo hover:underline">
            @santoshallu1234@gmail.com
          </Link>
        </div>
      </div>
    </footer>
  )
}


import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import img from "../../Speakify.png"

export default function Header() {
  return (
    <header className="flex justify-between items-center py-8 px-4">
      <Image src={img} alt="Translation Logo" width={100} height={100} />
      <h1 className="text-3xl font-bold mt-4 mb-2">Translate Your Text and Voice</h1>
      <div className="flex gap-2">
        <Link href="/">
          <Button className="bg-[#5e17eb] hover:bg-[#4a11c0] text-white">
            Translate
          </Button>
        </Link>
        {/*<Link href="/language-quiz">
          <Button className="bg-[#5e17eb] hover:bg-[#4a11c0] text-white">
            Language Quiz
          </Button>
        </Link>*/}
      </div>
    </header>
  )
}


import Image from "next/image"
import { Button } from "@/components/ui/button"
import img from "../../Speakify.png"
export default function Header() {
  return (
    <header className="flex flex-col items-center justify-center py-8 bg-black text-white">
      <Image src={img} alt="Translation Logo" width={100} height={100} />
      <h1 className="text-3xl font-bold mt-4 mb-2">Translate Your Text and Voice</h1>
      <Button className="bg-[#5e17eb] hover:bg-[#4a11c0] text-white">Start Translating</Button>
    </header>
  )
}


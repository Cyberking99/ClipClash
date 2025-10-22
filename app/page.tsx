import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
export default function Landing() {
  return (
    <div className="min-h-screen bg-[#f9f8f8]">
      <div className="container py-24">
        <section className="mx-auto max-w-3xl text-center space-y-6">
         
          <div>
            <div>

            </div>
             <div className="flex flex-row items-center justify-center">
             <h2 className="text-[#1f4140] text-4xl font-bold">Battle </h2>
             <h2 className="text-[#1f4140] text-4xl font-bold ml-2">Vote </h2>
             </div>
             
             <h2 className="text-[#1f4140] text-4xl font-bold">Earn</h2>
          </div>
          <p className="text-lg text-neutral-600">
          Upload clips, compete in head-to-head battles, and climb the on-chain leaderboard.
          </p>


          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/home">Let's Go </Link>
            </Button>
          </div>
        </section>

         <div>
           <Image src="/dancer2.png" alt="Hero" width={1000} height={1000} />
         </div>
      </div>
    </div>
  )
}

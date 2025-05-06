import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, AlertTriangle, Activity, Clock } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-rose-50 to-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Safety and Support for Women
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  HerSafety is a secure platform that allows women to report incidents safely, track case progress, and
                  access emergency help instantly. Authorities can manage and resolve reported cases through a secure
                  dashboard.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/register">
                  <Button className="bg-rose-600 hover:bg-rose-700">Get Started</Button>
                </Link>
                <Link href="/report-incident">
                  <Button variant="outline">Report Incident</Button>
                </Link>
              </div>
            </div>
            <img
              src="/placeholder.svg?height=550&width=550"
              alt="HerSafety Platform"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              width={550}
              height={550}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform provides comprehensive tools to ensure safety and support
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mt-12">
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <Shield className="h-12 w-12 text-rose-600" />
              <h3 className="text-xl font-bold">Secure Reporting</h3>
              <p className="text-sm text-muted-foreground text-center">
                Report incidents securely with complete privacy and confidentiality
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <AlertTriangle className="h-12 w-12 text-rose-600" />
              <h3 className="text-xl font-bold">Emergency SOS</h3>
              <p className="text-sm text-muted-foreground text-center">
                One-tap emergency alert system that shares your location with authorities
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <Activity className="h-12 w-12 text-rose-600" />
              <h3 className="text-xl font-bold">Case Tracking</h3>
              <p className="text-sm text-muted-foreground text-center">
                Monitor the progress of your reported incidents in real-time
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <Clock className="h-12 w-12 text-rose-600" />
              <h3 className="text-xl font-bold">Quick Response</h3>
              <p className="text-sm text-muted-foreground text-center">
                Authorities can quickly respond and update case status through the dashboard
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-rose-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Feel Safer?</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of women who have found security and support through our platform
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/register">
                <Button className="bg-rose-600 hover:bg-rose-700">Create Account</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

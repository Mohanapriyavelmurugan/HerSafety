"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, FileText } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <div className="container py-10 text-center">Loading...</div>
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container max-w-4xl mx-auto py-10">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
          <p className="text-muted-foreground">What would you like to do today?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="flex flex-col h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-rose-600" />
                Report an Incident
              </CardTitle>
              <CardDescription>Report a new incident with details and optional evidence</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">
                Provide information about what happened, when and where it occurred, and upload any evidence you may
                have.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/report-incident" className="w-full">
                <Button className="w-full bg-rose-600 hover:bg-rose-700">Report Incident</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="flex flex-col h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-rose-600" />
                Track Your Case
              </CardTitle>
              <CardDescription>Check the status and updates on your reported incidents</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">
                Enter your case tracking ID to see the current status, updates from authorities, and next steps.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/track-case" className="w-full">
                <Button variant="outline" className="w-full">
                  Track Case
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <div className="bg-rose-50 p-6 rounded-lg">
          <h2 className="text-lg font-medium mb-2">Your Recent Cases</h2>
          <p className="text-sm text-muted-foreground mb-4">
            {localStorage.getItem("hersafety_user_incidents")
              ? "Here are your recently reported incidents:"
              : "You haven't reported any incidents yet."}
          </p>

          {localStorage.getItem("hersafety_user_incidents") && (
            <div className="space-y-2">
              {JSON.parse(localStorage.getItem("hersafety_user_incidents") || "[]").map((incident: any) => (
                <div key={incident.id} className="flex justify-between items-center p-3 bg-white rounded border">
                  <div>
                    <p className="font-medium">{incident.id}</p>
                    <p className="text-sm text-muted-foreground">{incident.date}</p>
                  </div>
                  <Link href={`/track-case?caseId=${incident.id}`}>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

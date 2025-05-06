"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

const formSchema = z.object({
  caseId: z.string().min(5, {
    message: "Case ID must be at least 5 characters.",
  }),
})

export default function TrackCasePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [caseData, setCaseData] = useState<any | null>(null)
  const [notFound, setNotFound] = useState(false)
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const caseIdParam = searchParams.get("caseId")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caseId: caseIdParam || "",
    },
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  // If caseId is provided in URL, automatically search for it
  useEffect(() => {
    if (caseIdParam) {
      form.setValue("caseId", caseIdParam)
      handleSearch(caseIdParam)
    }
  }, [caseIdParam])

  function handleSearch(caseId: string) {
    setIsLoading(true)
    setNotFound(false)
    setCaseData(null)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)

      // Get incidents from localStorage
      const incidents = JSON.parse(localStorage.getItem("hersafety_incidents") || "[]")
      const foundCase = incidents.find((incident: any) => incident.id === caseId)

      if (foundCase) {
        setCaseData(foundCase)
      } else {
        setNotFound(true)
      }
    }, 1000)
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    handleSearch(values.caseId)
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "New":
        return "bg-blue-500"
      case "In Progress":
        return "bg-yellow-500"
      case "Resolved":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  if (authLoading) {
    return <div className="container py-10 text-center">Loading...</div>
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container max-w-2xl mx-auto py-10">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Track Your Case</h1>
          <p className="text-muted-foreground">Enter your case ID to check the current status and updates</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="caseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Case ID</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. INC-123456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Tracking...
                </>
              ) : (
                "Track Case"
              )}
            </Button>
          </form>
        </Form>

        {notFound && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-600">Case Not Found</CardTitle>
              <CardDescription>
                We couldn't find a case with the ID you provided. Please check the ID and try again.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {caseData && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Case {caseData.id}</CardTitle>
                <Badge className={getStatusColor(caseData.status)}>{caseData.status}</Badge>
              </div>
              <CardDescription>
                Reported on {caseData.date} at {caseData.time}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Location</h3>
                  <p className="text-sm text-muted-foreground">{caseData.location}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Type</h3>
                  <p className="text-sm text-muted-foreground">{caseData.type}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium">Description</h3>
                <p className="text-sm text-muted-foreground">{caseData.description}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Case Updates</h3>
                <div className="space-y-3">
                  {caseData.updates &&
                    caseData.updates.map((update: any, index: number) => (
                      <div key={index} className="border-l-2 border-rose-200 pl-4 py-1">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium">{update.date}</p>
                          <p className="text-sm text-muted-foreground">{update.time}</p>
                        </div>
                        <p className="text-sm">{update.message}</p>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard")}>
                Back to Dashboard
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}

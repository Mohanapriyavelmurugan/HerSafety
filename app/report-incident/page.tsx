"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Upload } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const MAX_FILE_SIZE = 5000000 // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "video/mp4"]

const formSchema = z.object({
  date: z.date({
    required_error: "Please select a date.",
  }),
  time: z.string().min(1, {
    message: "Please select a time.",
  }),
  location: z.string().min(5, {
    message: "Location must be at least 5 characters.",
  }),
  incidentType: z.string({
    required_error: "Please select an incident type.",
  }),
  description: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters.",
    })
    .max(500, {
      message: "Description must not exceed 500 characters.",
    }),
  evidence: z
    .any()
    .optional()
    .refine((files) => {
      if (!files || files.length === 0) return true
      return files[0]?.size <= MAX_FILE_SIZE
    }, `Max file size is 5MB.`)
    .refine((files) => {
      if (!files || files.length === 0) return true
      return ACCEPTED_IMAGE_TYPES.includes(files[0]?.type)
    }, "Only .jpg, .jpeg, .png, .webp and .mp4 formats are supported."),
})

export default function ReportIncidentPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [caseId, setCaseId] = useState("")
  const { toast } = useToast()
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      time: "",
      location: "",
      description: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    // Generate a unique case ID
    const newCaseId = "INC-" + Math.floor(100000 + Math.random() * 900000)
    setCaseId(newCaseId)

    // Create incident object
    const incident = {
      id: newCaseId,
      userId: user?.id,
      date: format(values.date, "yyyy-MM-dd"),
      time: values.time,
      location: values.location,
      type: values.incidentType,
      description: values.description,
      status: "New",
      reporter: user?.name,
      evidence: values.evidence && values.evidence.length > 0,
      updates: [
        {
          date: format(new Date(), "yyyy-MM-dd"),
          time: format(new Date(), "HH:mm"),
          message: "Case received and pending review.",
        },
      ],
    }

    // Simulate API call
    setTimeout(() => {
      // Save to localStorage for demo purposes
      const incidents = JSON.parse(localStorage.getItem("hersafety_incidents") || "[]")
      incidents.push(incident)
      localStorage.setItem("hersafety_incidents", JSON.stringify(incidents))

      // Save to user's incidents
      const userIncidents = JSON.parse(localStorage.getItem("hersafety_user_incidents") || "[]")
      userIncidents.push({
        id: incident.id,
        date: incident.date,
        type: incident.type,
        location: incident.location,
        status: incident.status,
      })
      localStorage.setItem("hersafety_user_incidents", JSON.stringify(userIncidents))

      setIsLoading(false)
      setShowSuccessDialog(true)
    }, 2000)
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
          <h1 className="text-3xl font-bold">Report an Incident</h1>
          <p className="text-muted-foreground">
            Please provide details about the incident. All information is kept confidential.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Incident</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time of Incident</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the location of the incident" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="incidentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type of Incident</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select incident type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="harassment">Harassment</SelectItem>
                      <SelectItem value="assault">Assault</SelectItem>
                      <SelectItem value="stalking">Stalking</SelectItem>
                      <SelectItem value="domestic_violence">Domestic Violence</SelectItem>
                      <SelectItem value="workplace_harassment">Workplace Harassment</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Provide details about what happened" className="min-h-[120px]" {...field} />
                  </FormControl>
                  <FormDescription>Please include any relevant details that might help authorities.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="evidence"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Evidence (Optional)</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="dropzone-file"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-3 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">Images or videos (MAX. 5MB)</p>
                        </div>
                        <Input
                          id="dropzone-file"
                          type="file"
                          className="hidden"
                          accept=".jpg,.jpeg,.png,.webp,.mp4"
                          onChange={(e) => {
                            const files = e.target.files
                            onChange(files)
                          }}
                          {...fieldProps}
                        />
                      </label>
                    </div>
                  </FormControl>
                  <FormDescription>Upload photos or videos related to the incident.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700" disabled={isLoading}>
              {isLoading ? "Submitting Report..." : "Submit Report"}
            </Button>
          </form>
        </Form>
      </div>

      {/* Success Dialog with Case ID */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Incident Reported Successfully</DialogTitle>
            <DialogDescription>Your incident has been reported and is now being processed.</DialogDescription>
          </DialogHeader>
          <div className="p-6 space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Your Case Tracking ID:</p>
              <p className="text-xl font-bold text-rose-600">{caseId}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Please save this ID to track the status of your case.
              </p>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowSuccessDialog(false)
                form.reset()
              }}
              className="sm:flex-1"
            >
              Report Another Incident
            </Button>
            <Button
              onClick={() => {
                setShowSuccessDialog(false)
                router.push(`/track-case?caseId=${caseId}`)
              }}
              className="bg-rose-600 hover:bg-rose-700 sm:flex-1"
            >
              Track This Case
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

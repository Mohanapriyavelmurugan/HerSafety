"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { emergencyAPI } from "@/lib/api"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

export default function EmergencySOS() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const { toast } = useToast()

  const handleSOS = async () => {
    setIsSending(true)
    try {
      // Get user's current location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })

      const location = `${position.coords.latitude},${position.coords.longitude}`
      
      // Send SOS signal to backend
      await emergencyAPI.sendSOS(location)
      
      toast({
        title: "SOS Signal Sent",
        description: "Emergency contacts have been notified of your situation.",
        variant: "destructive",
      })
      
      setIsDialogOpen(false)
    } catch (error) {
      console.error("SOS error:", error)
      toast({
        title: "Error",
        description: "Failed to send SOS signal. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <>
      <Button
        variant="destructive"
        size="lg"
        className="fixed bottom-4 right-4 rounded-full p-4 shadow-lg"
        onClick={() => setIsDialogOpen(true)}
      >
        <AlertCircle className="h-6 w-6" />
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Emergency SOS</DialogTitle>
            <DialogDescription>
              This will notify your emergency contacts and local authorities of your situation.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleSOS}
              disabled={isSending}
            >
              {isSending ? "Sending..." : "Send SOS"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

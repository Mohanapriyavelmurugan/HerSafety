"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function EmergencySOS() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSOS = () => {
    setIsSending(true)
    // Simulate API call without using features that might trigger Service Worker
    const timer = setTimeout(() => {
      setIsSending(false)
      setIsSuccess(true)
      // Reset after 3 seconds
      const resetTimer = setTimeout(() => {
        setIsSuccess(false)
        setIsDialogOpen(false)
        clearTimeout(resetTimer)
      }, 3000)
      clearTimeout(timer)
    }, 2000)
  }

  return (
    <>
      <Button
        variant="destructive"
        size="lg"
        className="fixed bottom-6 right-6 z-50 rounded-full h-16 w-16 shadow-lg flex items-center justify-center"
        onClick={() => setIsDialogOpen(true)}
      >
        SOS
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-destructive">
              <AlertCircle className="mr-2 h-5 w-5" />
              Emergency SOS
            </DialogTitle>
            <DialogDescription>
              This will send your current location and alert to emergency contacts and nearby authorities.
            </DialogDescription>
          </DialogHeader>

          {!isSuccess ? (
            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleSOS} disabled={isSending}>
                {isSending ? "Sending..." : "Send Emergency Alert"}
              </Button>
            </DialogFooter>
          ) : (
            <div className="p-4 bg-green-50 text-green-700 rounded-md text-center">
              Emergency alert sent successfully! Help is on the way.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

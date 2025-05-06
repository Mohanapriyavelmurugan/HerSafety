"use client"

import { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Shield } from "lucide-react"

const formSchema = z.object({
  policeId: z.string().min(5, {
    message: "Police ID must be at least 5 characters.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
})

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      policeId: "",
      password: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)

      // For demo purposes, only allow specific credentials
      if (values.policeId === "POLICE123" && values.password === "admin123") {
        toast({
          title: "Login successful!",
          description: "Welcome to the admin dashboard.",
        })
        // Redirect to admin dashboard
        window.location.href = "/admin-dashboard"
      } else {
        toast({
          title: "Login failed",
          description: "Invalid credentials. Please try again.",
          variant: "destructive",
        })
      }
    }, 2000)
  }

  return (
    <div className="container max-w-md mx-auto py-10">
      <div className="space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="bg-rose-100 p-3 rounded-full">
            <Shield className="h-8 w-8 text-rose-600" />
          </div>
          <h1 className="text-3xl font-bold">Authority Login</h1>
          <p className="text-muted-foreground">Login to access the admin dashboard</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="policeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Police/Authority ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm">
          <p className="text-muted-foreground">For demo purposes, use:</p>
          <p className="text-muted-foreground">ID: POLICE123, Password: admin123</p>
        </div>

        <div className="text-center text-sm">
          <Link href="/login" className="underline text-rose-600">
            Back to User Login
          </Link>
        </div>
      </div>
    </div>
  )
}

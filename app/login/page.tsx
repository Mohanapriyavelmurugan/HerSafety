"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
})

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showRegisterAlert, setShowRegisterAlert] = useState(false)
  const { toast } = useToast()
  const { login, user } = useAuth()
  const router = useRouter()

  // Check if there are any registered users
  useEffect(() => {
    const registeredUsers = JSON.parse(localStorage.getItem("hersafety_registered_users") || "[]")
    setShowRegisterAlert(registeredUsers.length === 0)
  }, [])

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const success = await login(values.email, values.password)

      if (success) {
        toast({
          title: "Login successful!",
          description: "Welcome back to HerSafety.",
        })
        router.push("/dashboard")
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An error occurred during login.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-md mx-auto py-10">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground">Login to access your account</p>
        </div>

        {showRegisterAlert && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No account found</AlertTitle>
            <AlertDescription>
              You need to register first before you can login.{" "}
              <Link href="/register" className="font-medium underline underline-offset-4">
                Register now
              </Link>
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter your email" {...field} />
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

            <div className="text-right text-sm">
              <Link href="/forgot-password" className="text-rose-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="underline text-rose-600">
            Register
          </Link>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <div className="text-center">
          <Link href="/admin-login">
            <Button variant="outline" className="w-full">
              Login as Authority
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

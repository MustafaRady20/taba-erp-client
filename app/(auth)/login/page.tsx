"use client"

import { useForm } from "react-hook-form"
import { Mail, Lock, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"

type FormData = {
  username: string
  password: string
  remember?: boolean
}

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: { username: "", password: "", remember: false },
  })

  async function onSubmit(data: FormData) {
    // demo: replace with your authentication call
    try {
      console.log("Submitting login", data)
      // Example:
      // await fetch("/api/auth/login", { method: "POST", body: JSON.stringify(data) })
      // redirect on success...
      alert("Demo login submitted — check console")
    } catch (err) {
      console.error(err)
      alert("Login failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-2 md:p-6 lg:p-8">
            {/* Right - Form */}
        <div className="flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-3 md:p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-indigo-600 flex items-center justify-center">
                  {/* logo placeholder */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">تسجيل الدخول</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">ادخل بياناتك</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* username */}
              <div>
                <Label htmlFor="username" className="sr-only">
                  رقم الهاتف
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <Input
                    id="username"
                    placeholder="رقم الهاتف"
                    aria-invalid={!!errors.username}
                    className="pl-10"
                    {...register("username", {
                      required: "Username or email is required",
                      minLength: { value: 3, message: "Too short" },
                    })}
                  />
                </div>
                {errors.username && (
                  <p role="alert" className="mt-1 text-sm text-red-600">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* password */}
              <div>
                <Label htmlFor="password" className="sr-only">
                  كلمة المرور
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                    <Lock className="h-4 w-4" />
                  </span>
                  <Input
                    id="password"
                    type="password"
                    placeholder="كلمة المرور"
                    aria-invalid={!!errors.password}
                    className="pl-10"
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 6, message: "Password must be at least 6 characters" },
                    })}
                  />
                </div>
                {errors.password && (
                  <p role="alert" className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* remember + forgot
              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 text-sm">
                  <Checkbox id="remember" {...register("remember")} />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Remember me</span>
                </label>

                <a
                  href="#"
                  className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  Forgot password?
                </a>
              </div> */}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Check className="h-4 w-4 animate-pulse" />
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

          
          </Card>
        </div>
      </div>
    
  )
}

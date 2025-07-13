"use client";

import { useState, FormEvent, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GraduationCap, Mail, Lock, Eye, EyeOff, User, Github, BookOpen, PenTool, Lightbulb, Loader2 } from 'lucide-react'
import {  doSocialLogin } from '@/app/actions';
import { useRouter } from 'next/navigation';


interface User {
  id: number;
  email: string;
  password: string;
  name: string | null;
  provider: string; // You can replace this with an enum or proper type if necessary
  registered: boolean;
  role: string; // Replace this with the correct role type if you have it
  createdAt: Date;
  updatedAt: Date;
}


// Make the user prop accept `User | null | undefined`
interface RegisterPageProps {
  user: User | null | undefined;
}

export default function RegisterPage({ user }: RegisterPageProps) {

  const router= useRouter();

  const userid= user?.id;

  // Default values if the user is null or undefined
  const [userName, setUserName] = useState(user?.name || '');
  const [eMailId, setEMailId] = useState(user?.email || '');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmpasswordError, setConfirmPasswordError] = useState('');
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);



  const handleSubmitSocialLogin = async (action: "GOOGLE" | "GITHUB") => {
    try {
      const formType = 'register'; // since this is the login form
  
      // Call doSocialLogin with the action and formType directly
      await doSocialLogin(action, formType); // Pass formType and session explicitly
    } catch (error) {
      setGeneralError("Social login failed. Please try again.");
    }
  };

  const validateForm = () => {
    let isValid = true;
    setPasswordError("");
    setEmailError("");
    setConfirmPasswordError("");

    // Email validation
    if (!eMailId) {
      setEmailError("Email is required.");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(eMailId)) {
      setEmailError("Please enter a valid email.");
      isValid = false;
    } else {
      setEmailError(""); // Clear email error if validation passes
    }

    // Password validation
    if (!password) {
      setPasswordError("Password is required.");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      isValid = false;
    } else {
      setPasswordError(""); // Clear password error if validation passes
    }

    if(password != confirmPassword)
    {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const userid= user?.id;

    if (validateForm()) {
      setIsLoading(true);
      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userName, email: eMailId, password }),
        });
  
        const result = await response.json();
  
        if (result.ok) {
          // Success - use replace instead of push for faster navigation
          router.replace(`/learning_choice/${result.user.id}`);
        } else {
          // Failure
          setGeneralError(result.message);
        }
      } catch (error) {
        setGeneralError("An error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
          <BookOpen className="text-blue-200 w-64 h-64 animate-float" />
        </div>
        <div className="absolute top-3/4 left-3/4 transform -translate-x-1/2 -translate-y-1/2">
          <PenTool className="text-yellow-200 w-48 h-48 animate-float animation-delay-2000" />
        </div>
        <div className="absolute top-1/2 right-1/4 transform translate-x-1/2 -translate-y-1/2">
          <Lightbulb className="text-green-200 w-56 h-56 animate-float animation-delay-4000" />
        </div>
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl z-10">
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden backdrop-blur-sm bg-opacity-80">
          <div className="px-8 py-6 bg-yellow-400 flex items-center justify-center">
          <a href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <GraduationCap className="text-blue-600 w-12 h-12" />
              <h2 className="text-3xl font-bold text-blue-600 ml-3">StudyMate</h2>
            </a>
          </div>
          <div className="px-8 py-6 bg-blue-600 text-white text-center">
            <p className="text-lg font-semibold italic">
              "Embark on your journey of knowledge. Every great achievement begins with the decision to try."
            </p>
          </div>
          <form  className="px-8 py-6 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                Full Name
              </Label>
              <div className="relative">
                <Input
                  id="fullName"
                  type="text"
                  value={userName}
                  placeholder="John Doe"
                  required
                  className="pl-10 pr-4 py-2 w-full border rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => {setUserName(e.target.value);setGeneralError('');}}
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={eMailId}
                  placeholder="you@example.com"
                  required
                  className="pl-10 pr-4 py-2 w-full border rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => {setEMailId(e.target.value);setGeneralError('');}}
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
            {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-12 py-2 w-full border rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={confirmPassword}
                  onChange={(e) => {setConfirmPassword(e.target.value);setGeneralError('');}}
                  className="pl-10 pr-12 py-2 w-full border rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {confirmpasswordError && (
              <p className="text-red-500 text-sm">{confirmpasswordError}</p>
            )}
            </div>
            {generalError && <p className="text-red-500 text-sm">{generalError}</p>}
            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                required
                className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                I agree to the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a>
              </label>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 relative group overflow-hidden"
              disabled={isLoading}
            >
              <span className={`flex items-center justify-center ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
                Register
              </span>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
          </form>
          <div className="relative px-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300"></span>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or register with</span>
            </div>
          </div>
          <div className="px-8 py-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="submit" name="action" value="GOOGLE" onClick={() => handleSubmitSocialLogin('GOOGLE')}
                variant="outline"
                className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-2 px-4 rounded-full transition duration-300 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                  />
                </svg>
                Google
              </Button>
              <Button
                type="submit" name="action" value="GITHUB"
                variant="outline"
                className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-2 px-4 rounded-full transition duration-300 flex items-center justify-center"
                onClick={() => handleSubmitSocialLogin('GITHUB')}
              >
                <Github className="w-5 h-5 mr-2" />
                GitHub
              </Button>
            </div>
          </div>
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between">
            <p className="text-sm text-gray-500 mb-2 sm:mb-0">Already have an account?</p>
            <a
              href="/auth/login"
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              Sign in to StudyMate
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
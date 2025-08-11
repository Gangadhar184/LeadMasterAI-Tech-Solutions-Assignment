import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import api from '@/lib/api';
import { AuthContext } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';



const signUpSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

const signInSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

const Signup = () => {

  const [isSignUp, setIsSignUp] = useState(false);

    const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(isSignUp ? signUpSchema : signInSchema)
  });

  const navigate = useNavigate();
  const {signup, login} = useContext(AuthContext);

  const onSubmit = async (data) => {
  try {
    if (isSignUp) {
      const res = await api.post("/auth/signup", {
        userName: data.username,  // backend expects userName
        email: data.email,
        password: data.password,
      });
      signup(res.data.user);
      navigate("/quiz")
    } else {
      const res = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      });
      login(res.data.user);
      navigate("/quiz"); 
    }
  } catch (error) {
    console.error("Authentication error:", error.response?.data || error.message);
  }
};


  return (
    <div className="max-w-md w-full mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        {isSignUp ? "Sign Up" : "Sign In"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {isSignUp && (
          <div>
            <Label htmlFor="username">Username</Label>
            <Input id="username" type="text" placeholder="Your username" {...register("username")} />
            {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
          </div>
        )}

        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>

        <Button type="submit" className="w-full">
          {isSignUp ? "Sign Up" : "Sign In"}
        </Button>
      </form>

      <p className="text-sm text-center mt-4">
        {isSignUp ? "Already have an account? " : "Don't have an account? "}
        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-primary hover:underline"
        >
          {isSignUp ? "Sign in" : "Sign up"}
        </button>
      </p>
    </div>
  );
}

export default Signup;

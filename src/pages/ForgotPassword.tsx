
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Meta from "@/components/Meta";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Mail, AlertTriangle, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

// Reset password form schema
const resetSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ResetFormValues = z.infer<typeof resetSchema>;

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Reset form
  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
  });

  // Handle form submission
  const onSubmit = async (values: ResetFormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });
      
      if (error) {
        console.error("Password reset error:", error);
        toast.error(error.message || "Failed to send reset email");
        return;
      }
      
      setIsSuccess(true);
      toast.success("Password reset email sent successfully");
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Meta
        title="Reset Password | URL Shortener"
        description="Reset your password to regain access to your URL Shortener account."
      />
      
      <div className="container mx-auto px-4 py-12 flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Reset Password</h1>
            <p className="text-muted-foreground mt-2">
              Enter your email to receive a password reset link
            </p>
          </div>
          
          <div className="bg-card border rounded-lg shadow-sm p-6">
            {isSuccess ? (
              <div className="text-center py-8">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Email Sent</h2>
                <p className="text-muted-foreground mb-6">
                  We've sent a password reset link to your email address. Please check your inbox and follow the instructions.
                </p>
                <Link to="/auth">
                  <Button className="w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Login
                  </Button>
                </Link>
              </div>
            ) : (
              <Form {...resetForm}>
                <form onSubmit={resetForm.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={resetForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                              placeholder="youremail@example.com" 
                              className="pl-10" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="pt-2">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Sending..." : "Send Reset Link"}
                    </Button>
                  </div>
                  
                  <div className="text-center pt-2">
                    <Link 
                      to="/auth" 
                      className="text-sm text-primary hover:underline flex items-center justify-center"
                    >
                      <ArrowLeft className="mr-1 h-3 w-3" />
                      Back to Login
                    </Link>
                  </div>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;


import React, { useState, useEffect } from 'react';
import Meta from '@/components/Meta';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { AlertTriangle, Shield, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const reportReasons = [
  { id: 'phishing', label: 'Phishing attempt' },
  { id: 'malware', label: 'Contains malware' },
  { id: 'scam', label: 'Scam or fraud' },
  { id: 'inappropriate', label: 'Inappropriate content' },
  { id: 'impersonation', label: 'Brand impersonation' },
  { id: 'other', label: 'Other (please specify)' },
];

// Form validation schema
const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL" }),
  reason: z.string().min(1, { message: "Please select a reason" }),
  message: z.string().optional(),
  captchaAnswer: z.string().refine((val) => val === String(captchaResult), {
    message: "Incorrect answer, please try again",
  }),
});

// Generate random math captcha
let firstNum = 0;
let secondNum = 0;
let operation = '';
let captchaResult = 0;

const generateCaptcha = () => {
  firstNum = Math.floor(Math.random() * 10) + 1;
  secondNum = Math.floor(Math.random() * 10) + 1;
  
  // Randomly choose between addition and multiplication
  const operations = [
    { symbol: '+', calculate: (a: number, b: number) => a + b },
    { symbol: '*', calculate: (a: number, b: number) => a * b },
  ];
  
  const selectedOp = operations[Math.floor(Math.random() * operations.length)];
  operation = selectedOp.symbol;
  captchaResult = selectedOp.calculate(firstNum, secondNum);
  
  return { firstNum, secondNum, operation, captchaResult };
};

const ReportMalicious: React.FC = () => {
  const { toast } = useToast();
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [isSuccess, setIsSuccess] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
      reason: '',
      message: '',
      captchaAnswer: '',
    },
  });
  
  useEffect(() => {
    // Update the captcha validation schema whenever captcha changes
    form.clearErrors('captchaAnswer');
  }, [captcha, form]);
  
  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    console.log('Form submitted:', values);
    
    // Here you would typically send this data to your backend
    // For now, we'll just simulate a successful submission
    toast({
      title: "Report submitted",
      description: "Thank you for helping us keep UrlZip safe.",
    });
    
    setIsSuccess(true);
  };
  
  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    form.setValue('captchaAnswer', '');
  };
  
  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Meta
          title="Report Submitted - UrlZip"
          description="Thank you for submitting a report of a malicious URL to UrlZip."
          url="https://urlzip.in/report-malicious"
        />
        <div className="container mx-auto px-4 flex-1">
          <Header />
          
          <main className="py-12">
            <div className="max-w-lg mx-auto text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold mb-4">Report Submitted</h1>
              <p className="text-gray-600 mb-8">
                Thank you for helping us keep UrlZip safe. Our team will review your report and take appropriate action.
              </p>
              <Button onClick={() => window.location.href = "/"}>
                Return to Home
              </Button>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Meta
        title="Report Malicious URL - UrlZip"
        description="Report a malicious or suspicious URL to the UrlZip team."
        url="https://urlzip.in/report-malicious"
      />
      <div className="container mx-auto px-4 flex-1">
        <Header />
        
        <main className="py-12">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <h1 className="text-3xl font-bold">Report Malicious URL</h1>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-amber-800">Help us protect our users</h3>
                  <p className="text-amber-700">
                    If you've encountered a URL that appears to be malicious, fraudulent, or contains inappropriate content, 
                    please report it here. Our team will review your submission and take appropriate action.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Suspicious URL*</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reason for Report*</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a reason" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {reportReasons.map((reason) => (
                              <SelectItem key={reason.id} value={reason.id}>
                                {reason.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Details (optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Please provide any additional information about this URL" 
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="captchaAnswer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Verify you're human: {captcha.firstNum} {captcha.operation} {captcha.secondNum} = ?
                        </FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input placeholder="Enter the answer" {...field} />
                          </FormControl>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={refreshCaptcha}
                            className="flex-shrink-0"
                          >
                            Refresh
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full">
                    Submit Report
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ReportMalicious;

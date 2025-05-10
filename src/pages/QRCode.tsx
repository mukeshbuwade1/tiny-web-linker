
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
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
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import Meta from "@/components/Meta";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// QR code form schema
const qrCodeSchema = z.object({
  text: z.string().min(1, "QR content is required"),
  size: z.number().min(100).max(500),
  color: z.string(),
  backgroundColor: z.string(),
  shortenUrl: z.boolean().default(false)
});

type QRCodeFormValues = z.infer<typeof qrCodeSchema>;

const QRCode = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!session) {
      navigate("/auth");
      toast.error("You need to be logged in to access this page");
    }
  }, [session, navigate]);

  // URL validation
  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (err) {
      return false;
    }
  };

  // Shorten URL
  const shortenUrl = async (url: string) => {
    try {
      // Call the Supabase Edge Function with authentication
      const options: any = {
        body: { url },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      };

      const { data, error } = await supabase.functions.invoke("short-url-generator", options);

      if (error) {
        throw new Error(error.message || "Failed to shorten URL");
      }

      if (data.error) {
        throw new Error(data.error);
      }

      return data.shortUrl;
    } catch (error) {
      console.error("Error shortening URL:", error);
      throw error;
    }
  };

  // Track QR code generation
  const trackQrCode = async (content: string, wasShortened: boolean) => {
    if (!session) return;
    
    try {
      // Record QR code generation in analytics
      await supabase.functions.invoke("analytics", {
        body: { 
          action: 'track-qr-code',
          content,
          wasShortened
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        }
      });
    } catch (error) {
      console.error("Error tracking QR code:", error);
    }
  };

  // QR code form
  const form = useForm<QRCodeFormValues>({
    resolver: zodResolver(qrCodeSchema),
    defaultValues: {
      text: "",
      size: 300,
      color: "000000",
      backgroundColor: "FFFFFF",
      shortenUrl: false
    },
  });

  // Generate QR code
  const generateQrCode = async (values: QRCodeFormValues) => {
    setIsLoading(true);
    try {
      let content = values.text;
      let wasShortened = false;
      
      // If URL shortening is enabled and the content is a valid URL, shorten it
      if (values.shortenUrl && validateUrl(values.text)) {
        try {
          const shortened = await shortenUrl(values.text);
          content = shortened;
          setShortUrl(shortened);
          wasShortened = true;
        } catch (error) {
          toast.error("Failed to shorten URL. Using original URL instead.");
        }
      } else {
        setShortUrl(null);
      }
      
      // Use the QR code API
      const url = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(content)}&size=${values.size}x${values.size}&color=${values.color.replace('#', '')}&bgcolor=${values.backgroundColor.replace('#', '')}`;
      setQrCodeUrl(url);
      
      // Track QR code generation
      await trackQrCode(content, wasShortened);
      
      toast.success("QR code generated successfully!");
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast.error("Failed to generate QR code");
    } finally {
      setIsLoading(false);
    }
  };

  // Download QR code
  const downloadQrCode = () => {
    if (!qrCodeUrl) return;
    
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = "qrcode.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Meta
        title="QR Code Generator | URL Shortener"
        description="Generate customized QR codes for your links and content."
      />
      
      <div className="container mx-auto px-4 flex-1">
        <Header />
        
        <main className="py-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">QR Code Generator</h1>
            <p className="text-muted-foreground mb-8 text-center">
              Generate customized QR codes for your links, text, or any content
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Card>
                  <CardContent className="pt-6">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(generateQrCode)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="text"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Content</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter URL or text" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="shortenUrl"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Shorten URL</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                  Create a short URL before generating QR code
                                </p>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="size"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Size: {field.value}px</FormLabel>
                              <FormControl>
                                <Slider
                                  min={100}
                                  max={500}
                                  step={10}
                                  value={[field.value]}
                                  onValueChange={(value) => field.onChange(value[0])}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="color"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Foreground Color</FormLabel>
                                <FormControl>
                                  <div className="flex items-center space-x-2">
                                    <Input
                                      type="color"
                                      className="w-12 h-10 p-1"
                                      value={`#${field.value}`}
                                      onChange={(e) => field.onChange(e.target.value.replace('#', ''))}
                                    />
                                    <Input 
                                      value={field.value} 
                                      onChange={(e) => field.onChange(e.target.value.replace('#', ''))}
                                      placeholder="000000" 
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="backgroundColor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Background Color</FormLabel>
                                <FormControl>
                                  <div className="flex items-center space-x-2">
                                    <Input
                                      type="color"
                                      className="w-12 h-10 p-1"
                                      value={`#${field.value}`}
                                      onChange={(e) => field.onChange(e.target.value.replace('#', ''))}
                                    />
                                    <Input 
                                      value={field.value} 
                                      onChange={(e) => field.onChange(e.target.value.replace('#', ''))}
                                      placeholder="FFFFFF" 
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <Button type="submit" className="w-full" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            "Generate QR Code"
                          )}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="h-full flex flex-col justify-center items-center">
                  <CardContent className="pt-6 flex flex-col items-center justify-center h-full w-full">
                    {qrCodeUrl ? (
                      <div className="text-center">
                        <div className="mb-4 p-4 bg-white border rounded-lg inline-block">
                          <img src={qrCodeUrl} alt="Generated QR Code" className="max-w-full" />
                        </div>
                        {shortUrl && (
                          <div className="mb-3 text-sm">
                            <p className="font-medium">Shortened URL:</p>
                            <p className="text-primary break-all">{shortUrl}</p>
                          </div>
                        )}
                        <Button onClick={downloadQrCode} className="mt-2">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground p-8">
                        QR code will appear here after generation
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default QRCode;

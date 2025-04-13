
import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import Meta from "@/components/Meta";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Download } from "lucide-react";

// QR code form schema
const qrCodeSchema = z.object({
  text: z.string().min(1, "QR content is required"),
  size: z.number().min(100).max(500),
  color: z.string(),
  backgroundColor: z.string(),
});

type QRCodeFormValues = z.infer<typeof qrCodeSchema>;

const QRCode = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
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

  // QR code form
  const form = useForm<QRCodeFormValues>({
    resolver: zodResolver(qrCodeSchema),
    defaultValues: {
      text: "",
      size: 300,
      color: "000000",
      backgroundColor: "FFFFFF",
    },
  });

  // Generate QR code
  const generateQrCode = async (values: QRCodeFormValues) => {
    setIsLoading(true);
    try {
      // Use the QR code API
      const url = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(values.text)}&size=${values.size}x${values.size}&color=${values.color.replace('#', '')}&bgcolor=${values.backgroundColor.replace('#', '')}`;
      setQrCodeUrl(url);
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

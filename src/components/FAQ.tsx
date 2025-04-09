
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Info } from "lucide-react";

const FAQ = () => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-left font-medium">
          What is a URL shortener?
        </AccordionTrigger>
        <AccordionContent>
          <p className="text-muted-foreground">
            A URL shortener is a tool that converts long URLs into shorter, more manageable links. 
            These shortened URLs redirect to the original long URL when accessed. 
            URL shorteners are especially useful for sharing links on social media, in messages, 
            or anywhere character count matters.
          </p>
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="item-2">
        <AccordionTrigger className="text-left font-medium">
          How do I create a shortened URL?
        </AccordionTrigger>
        <AccordionContent>
          <p className="text-muted-foreground">
            Creating a shortened URL with UrlZip is simple:
          </p>
          <ol className="list-decimal list-inside mt-2 space-y-1 text-muted-foreground">
            <li>Paste your long URL into the input field at the top of this page</li>
            <li>Click the "Shorten" button</li>
            <li>Copy your new shortened URL using the copy button</li>
            <li>Share your shortened link anywhere you want</li>
          </ol>
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="item-3">
        <AccordionTrigger className="text-left font-medium">
          Why do we need URL shorteners?
        </AccordionTrigger>
        <AccordionContent>
          <p className="text-muted-foreground">
            URL shorteners serve several important purposes:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
            <li>They make links more readable and easier to share</li>
            <li>They save space in character-limited platforms like Twitter</li>
            <li>They look cleaner in printed materials where long URLs are impractical</li>
            <li>They allow for tracking link clicks and engagement</li>
            <li>They can disguise complex URLs with parameters for a cleaner look</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="item-4">
        <AccordionTrigger className="text-left font-medium">
          Are shortened URLs safe to use?
        </AccordionTrigger>
        <AccordionContent>
          <p className="text-muted-foreground">
            When using UrlZip, shortened URLs are safe. We implement security measures to prevent
            malicious use of our service. However, as with any link on the internet, you should 
            exercise caution when clicking shortened URLs from unknown sources.
          </p>
          <div className="flex items-start mt-3 bg-blue-50 dark:bg-slate-800 p-3 rounded-md">
            <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="ml-2 text-sm">
              If you encounter a suspicious shortened URL, you can report it through our 
              <a href="/report-malicious" className="text-primary hover:underline ml-1">
                Report Malicious URL
              </a> page.
            </p>
          </div>
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="item-5">
        <AccordionTrigger className="text-left font-medium">
          Do shortened URLs expire?
        </AccordionTrigger>
        <AccordionContent>
          <p className="text-muted-foreground">
            UrlZip's shortened URLs do not expire. Once created, they will continue to redirect 
            to the original destination URL indefinitely, unless they contain content that violates 
            our terms of service.
          </p>
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="item-6">
        <AccordionTrigger className="text-left font-medium">
          Can I track clicks on my shortened URLs?
        </AccordionTrigger>
        <AccordionContent>
          <p className="text-muted-foreground">
            Yes, basic click tracking is available for all shortened URLs. Our system records each 
            click, allowing you to see how many times your link has been accessed. More advanced 
            analytics features may be added in future updates.
          </p>
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="item-7">
        <AccordionTrigger className="text-left font-medium">
          Is there a limit on how many URLs I can shorten?
        </AccordionTrigger>
        <AccordionContent>
          <p className="text-muted-foreground">
            Currently, we offer unlimited URL shortening for all users. There are no daily or 
            monthly limits on how many links you can create.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default FAQ;

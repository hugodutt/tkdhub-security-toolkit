import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Copy, Check } from "lucide-react";
import { generateResponse } from "@/lib/gemini";
import Navbar from "@/components/Navbar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

type TemplateCategory = "hosting" | "registrar" | "legal" | "csirt";

const categoryConfig = {
  hosting: {
    label: "Hosting Provider",
    intro: "We have identified a phishing website on your network:",
    prompt: "Focus on hosting removal and network security impact"
  },
  registrar: {
    label: "Registrar",
    intro: "We have identified a phishing website registered at:",
    prompt: "Focus on malicious domain registration and registration policy violations"
  },
  legal: {
    label: "Legal Team",
    intro: "We have identified a phishing website that requires immediate legal attention:",
    prompt: "Focus on legal implications of phishing activities and brand protection"
  },
  csirt: {
    label: "CSIRT",
    intro: "We are reporting a phishing incident targeting our organization:",
    prompt: "Focus on technical security aspects and user impact of the phishing campaign"
  }
};

export default function TemplateGeneratorPage() {
  const [url, setUrl] = useState("");
  const [client, setClient] = useState("");
  const [category, setCategory] = useState<TemplateCategory>("hosting");
  const [template, setTemplate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerateTemplate = async () => {
    if (!url || !client) return;
    setIsLoading(true);

    try {
      const prompt = `[TEMPLATE_GENERATOR]
You are a professional email template generator. Create a phishing takedown request email in English using EXACTLY this format, customized for ${categoryConfig[category].label}:

Dear Team,

${categoryConfig[category].intro}
${url} (IP will be added manually later).

[GENERATE A DETAILED PARAGRAPH ABOUT THE CLIENT AND PHISHING IMPACT:
- Start by clearly stating this is a fraudulent impersonation
- Include the client's official website in parentheses
- Provide a comprehensive description of the client's business (2-3 sentences):
  * Their market position/relevance
  * Main products/services
  * Geographic presence/reach
  * Any relevant certifications/partnerships

${category === "hosting" ? `- Focus on network security and hosting implications:
  * Emphasize the urgency of content removal
  * Highlight the active threat to users
  * Mention potential network abuse` : ""}

${category === "registrar" ? `- Focus on domain registration abuse:
  * Emphasize the malicious nature of the registration
  * Highlight violation of registration policies
  * Mention the urgency of domain suspension` : ""}

${category === "legal" ? `- Focus on legal implications:
  * Emphasize the fraudulent nature of the activity
  * Highlight potential consumer harm
  * Reference relevant phishing/fraud concerns` : ""}

${category === "csirt" ? `- Focus on security incident details:
  * Describe the phishing campaign characteristics
  * Highlight the technical threat aspects
  * Emphasize the urgency of incident response` : ""}

- Always include:
  * Type of data being collected
  * Potential impact on customers
  * Why it's particularly concerning for Brazilian users
Make this paragraph informative but not excessive - aim for 4-5 lines total]

We kindly ask your cooperation, according to your policies, to cease this activity and shut down the phishing page as soon as possible.

Regards,
[Your Name]

Client Info for customization: ${client}

IMPORTANT:
- Return ONLY the email template
- Do NOT include any analysis
- Do NOT include any additional information
- Keep the exact format above
- Make the client description informative but concise
- Focus on phishing-specific concerns for the selected category (${categoryConfig[category].label})`;

      const response = await generateResponse(prompt);
      setTemplate(response);
    } catch (error) {
      console.error("Error generating template:", error);
      setTemplate("An error occurred while generating the template. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(template);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "The template has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try copying manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container mx-auto p-6 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Takedown Request Template Generator</h1>
        
        <div className="grid gap-6">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Template Category</label>
                <Select
                  value={category}
                  onValueChange={(value: TemplateCategory) => setCategory(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select recipient type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hosting">Hosting Provider</SelectItem>
                    <SelectItem value="registrar">Registrar</SelectItem>
                    <SelectItem value="legal">Legal Team</SelectItem>
                    <SelectItem value="csirt">CSIRT</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phishing URL</label>
                <Input
                  placeholder="https://example.com/content"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Affected Client</label>
                <Input
                  placeholder="Client name, official website, and brief business description"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                />
              </div>

              <Button
                onClick={handleGenerateTemplate}
                disabled={isLoading || !url || !client}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Template...
                  </>
                ) : (
                  "Generate Template"
                )}
              </Button>
            </div>
          </Card>

          {template && (
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Generated Template</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  disabled={!template}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  <span className="ml-2">{copied ? "Copied!" : "Copy"}</span>
                </Button>
              </div>
              <Textarea
                value={template}
                readOnly
                className="min-h-[300px] font-mono"
              />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 
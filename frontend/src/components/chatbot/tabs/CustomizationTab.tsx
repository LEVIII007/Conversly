'use client';
import { useState } from 'react';
import { ChromePicker } from 'react-color';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Bot,
  MessageCircle,
  HelpCircle,
  MessageSquare,
  BrainCircuit,
  Copy,
  Minus,
  Upload,
  Frame,
  Code,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ChatbotPreview } from '@/components/chatbot/ChatbotPreview';
import { Highlight, themes } from 'prism-react-renderer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface CustomizationTabProps {
  chatbotId: string;
  prompt: string;
}

export function CustomizationTab({ chatbotId, prompt }: CustomizationTabProps) {
  const { toast } = useToast();

  // Basic / Widget settings
  const [color, setColor] = useState('#0e4b75');
  const [widgetHeader, setWidgetHeader] = useState('Support Bot');
  const [welcomeMessage, setWelcomeMessage] = useState('Hi! How can I help you today? 👋');
  const [promptscript, setPromptscript] = useState<string>(prompt);

  // Icon settings
  const [selectedIcon, setSelectedIcon] = useState<string>('chat');
  const [customIcon, setCustomIcon] = useState<string | null>(null);
  const icons = [
    { id: 'chat', component: <MessageCircle className="w-6 h-6" /> },
    { id: 'bot', component: <Bot className="w-6 h-6" /> },
    { id: 'brain', component: <BrainCircuit className="w-6 h-6" /> },
    { id: 'help', component: <HelpCircle className="w-6 h-6" /> },
    { id: 'message', component: <MessageSquare className="w-6 h-6" /> },
  ];

  // Button settings
  const [buttonAlignment, setButtonAlignment] = useState<'left' | 'right'>('right');
  const [showButtonText, setShowButtonText] = useState(false);
  const [widgetButtonText, setWidgetButtonText] = useState('Chat with us');

  // Size & position
  const [chatWidth, setChatWidth] = useState('350px');
  const [chatHeight, setChatHeight] = useState('500px');
  const [displayStyle, setDisplayStyle] = useState<'corner' | 'overlay'>('corner');

  // Domains configuration
  const [domains, setDomains] = useState(['']);

  // Starter questions configuration
  const [starterQuestions, setStarterQuestions] = useState<string[]>([
    'What is this about?',
    'How do I get started?',
    '',
    '',
  ]);

  // --- Integration Code ---
  const embedCode = `<script>
(function () {
  const botConfig = {
    botId: "${chatbotId}",
    color: "${color}",
    title: "${widgetHeader}",
    welcomeMessage: "${welcomeMessage}",
    headerText: "${widgetHeader}",
    apiUrl: "https://my0jhajg7c.execute-api.ap-southeast-1.amazonaws.com",
    buttonAlign: "${buttonAlignment}",
    buttonText: "${widgetButtonText}",
    height: "${chatHeight}",
    width: "${chatWidth}",
    displayStyle: "${displayStyle}",
    customIcon: ${customIcon ? `"${customIcon}"` : 'null'},
    starter_questions: ${JSON.stringify(starterQuestions.filter((q) => q.trim() !== ''))},
    prompt: "${promptscript}"
  };
  const script = document.createElement("script");
  script.src = "https://cloud-ide-shas.s3.us-east-1.amazonaws.com/docBot/chat.js";
  script.async = true;
  script.onload = () => {
    if (window.DocsBotAI) { window.DocsBotAI.init(botConfig); }
  };
  document.head.appendChild(script);
})();
</script>
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
`;

  const iframeCode = `<iframe
  COMING SOON!!
></iframe>`;

  // --- Helper Functions ---
  const handleAddDomain = () => {
    setDomains([...domains, '']);
  };

  const handleDomainChange = (index: number, value: string) => {
    const newDomains = [...domains];
    newDomains[index] = value;
    setDomains(newDomains);
  };

  const handleRemoveDomain = (index: number) => {
    const newDomains = domains.filter((_, i) => i !== index);
    setDomains(newDomains);
  };

  const copyToClipboard = (text: string, type: 'embed' | 'iframe') => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: `${type === 'embed' ? 'Widget' : 'iframe'} code copied to clipboard`,
    });
  };

  const renderCode = (code: string, language: string) => (
    <Highlight theme={themes.nightOwl} code={code.trim()} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={`p-3 rounded-lg text-xs overflow-x-auto whitespace-pre ${className}`}
          style={{ ...style, maxWidth: '100%' }}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })} className="whitespace-pre">
              <span className="select-none opacity-50 mr-4">{i + 1}</span>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );

  // Handle file upload and convert to base64
  const handleIconUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setCustomIcon(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* 1. Widget Customization */}
<div className="rounded-xl bg-card/50 backdrop-blur-sm p-6 border border-border/50 ">
  <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
    Widget Customization
  </h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Left Column: Theme, Header, and Welcome Message */}
    <div className="space-y-4">
      {/* Theme Color */}
      <div className="group">
        <label className="block text-sm font-medium mb-2 text-foreground/80">
          Theme Color
        </label>
        <div className="flex items-center gap-3">
          <Input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-16 h-10 p-1 rounded-lg cursor-pointer"
          />
          <Input
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="#000000"
            className="flex-1"
          />
        </div>
      </div>
      {/* Widget Header */}
      <div className="group">
        <label className="block text-sm font-medium mb-2 text-foreground/80">
          Widget Header
        </label>
        <Input
          value={widgetHeader}
          onChange={(e) => setWidgetHeader(e.target.value)}
          placeholder="Enter widget header text"
          className="w-full transition-all duration-200 focus:ring-2 ring-primary/20"
        />
      </div>
      {/* Welcome Message */}
      <div className="group">
        <label className="block text-sm font-medium mb-2 text-foreground/80">
          Welcome Message
        </label>
        <Textarea
          value={welcomeMessage}
          onChange={(e) => setWelcomeMessage(e.target.value)}
          placeholder="Enter welcome message"
          className="w-full min-h-[100px] transition-all duration-200 focus:ring-2 ring-primary/20"
        />
      </div>
    </div>

    {/* Right Column: Prompt Script */}
    <div className="space-y-4">
      <div className="group h-full">
        <label className="block text-sm font-medium mb-2 text-foreground/80]">
          Prompt Script
        </label>
        <Textarea
          value={promptscript}
          onChange={(e) => setPromptscript(e.target.value)}
          placeholder="Enter your prompt script"
          className="w-full h-full max-h-[267px] transition-all duration-200 focus:ring-2 ring-primary/20"
        />
      </div>
    </div>
  </div>
</div>
          {/* Right Column - Theme Color */}
          <div className="space-y-4">
            <div className="group">
              <label className="block text-sm font-medium mb-2 text-foreground/80">
                Theme Color
              </label>
              <div className="flex items-center gap-3">
                <Input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-16 h-10 p-1 rounded-lg cursor-pointer"
                />
                <Input
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="#000000"
                  className="flex-1"
                />
              </div>
            </div>
          </div>


      {/* 2. Icon Settings */}
      <div className="rounded-xl bg-card/50 backdrop-blur-sm p-6 border border-border/50">
        <h2 className="text-2xl font-semibold mb-4">Icon Settings</h2>
        <div className="flex flex-wrap items-center gap-4">
          {icons.map((icon) => (
            <Button
              key={icon.id}
              variant={selectedIcon === icon.id && !customIcon ? 'default' : 'outline'}
              onClick={() => {
                setSelectedIcon(icon.id);
                setCustomIcon(null);
              }}
              className="p-2"
            >
              {icon.component}
            </Button>
          ))}
          <div className="flex items-center gap-2">
            <label htmlFor="customIconUpload" className="cursor-pointer">
              <Upload className="w-6 h-6" />
            </label>
            <input
              id="customIconUpload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleIconUpload}
            />
            {customIcon && (
              <img src={customIcon} alt="Custom Icon" className="w-8 h-8 object-contain" />
            )}
          </div>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Select a preset icon or upload a custom icon. (Uploading a custom icon will override the preset.)
        </p>
      </div>

      {/* 3. Button Settings */}
      <div className="rounded-xl bg-card/50 backdrop-blur-sm p-6 border border-border/50">
        <h2 className="text-2xl font-semibold mb-4">Button Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium">Button Alignment:</label>
            <Button
              variant={buttonAlignment === 'left' ? 'default' : 'outline'}
              onClick={() => setButtonAlignment('left')}
            >
              Left
            </Button>
            <Button
              variant={buttonAlignment === 'right' ? 'default' : 'outline'}
              onClick={() => setButtonAlignment('right')}
            >
              Right
            </Button>
          </div>
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium">Show Button Text:</label>
            <input
              type="checkbox"
              checked={showButtonText}
              onChange={(e) => setShowButtonText(e.target.checked)}
              className="w-4 h-4"
            />
          </div>
          {showButtonText && (
            <div className="group">
              <label className="block text-sm font-medium">Button Text:</label>
              <Input
                value={widgetButtonText}
                onChange={(e) => setWidgetButtonText(e.target.value)}
                placeholder="Chat with us"
                className="w-full"
              />
            </div>
          )}
        </div>
      </div>

      {/* 4. Size & Position */}
      <div className="rounded-xl bg-card/50 backdrop-blur-sm p-6 border border-border/50">
        <h2 className="text-2xl font-semibold mb-6">Size &amp; Position</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-foreground/80">Widget Width</label>
            <Input
              value={chatWidth}
              onChange={(e) => setChatWidth(e.target.value)}
              placeholder="e.g., 350px"
              className="w-full"
            />
            <label className="block text-sm font-medium text-foreground/80">Widget Height</label>
            <Input
              value={chatHeight}
              onChange={(e) => setChatHeight(e.target.value)}
              placeholder="e.g., 500px"
              className="w-full"
            />
          </div>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-foreground/80">Display Style</label>
            <div className="flex items-center gap-4">
              <Button
                variant={displayStyle === 'corner' ? 'default' : 'outline'}
                onClick={() => setDisplayStyle('corner')}
              >
                Corner
              </Button>
              <Button
                variant={displayStyle === 'overlay' ? 'default' : 'outline'}
                onClick={() => setDisplayStyle('overlay')}
              >
                Overlay
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Allowed Domains */}
      <div className="rounded-xl bg-card/50 backdrop-blur-sm p-6 border border-border/50">
        <h2 className="text-2xl font-semibold mb-4">Allowed Domains</h2>
        <div className="space-y-2">
          {domains.map((domain, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={domain}
                onChange={(e) => handleDomainChange(index, e.target.value)}
                placeholder="https://example.com"
                className="flex-1"
              />
              {domains.length > 1 && (
                <Button variant="ghost" size="icon" onClick={() => handleRemoveDomain(index)}>
                  <Minus className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={handleAddDomain}>
            Add Domain
          </Button>
        </div>
      </div>

      {/* 6. Starter Questions */}
      <div className="rounded-xl bg-card/50 backdrop-blur-sm p-6 border border-border/50">
        <h2 className="text-2xl font-semibold mb-4">Starter Questions</h2>
        <div className="space-y-2">
          {starterQuestions.map((question, index) => (
            <Input
              key={index}
              value={question}
              onChange={(e) => {
                const newQuestions = [...starterQuestions];
                newQuestions[index] = e.target.value;
                setStarterQuestions(newQuestions);
              }}
              placeholder={`Starter Question ${index + 1}`}
              className="w-full"
            />
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStarterQuestions([...starterQuestions, ''])}
          >
            Add Question
          </Button>
        </div>
      </div>

      {/* 7. Integration */}
      <div className="rounded-xl bg-card/50 backdrop-blur-sm p-6 border border-border/50">
        <h2 className="text-2xl font-semibold mb-6">Integration</h2>
        <Tabs defaultValue="script" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="script">
              <Code className="w-4 h-4 mr-2" />
              Script Tag
            </TabsTrigger>
            <TabsTrigger value="iframe">
              <Frame className="w-4 h-4 mr-2" />
              iframe
            </TabsTrigger>
          </TabsList>

          <TabsContent value="script">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2"
                onClick={() => copyToClipboard(embedCode, 'embed')}
              >
                <Copy className="w-4 h-4" />
              </Button>
              {renderCode(embedCode, 'html')}
            </div>
          </TabsContent>

          <TabsContent value="iframe">
            <div className="relative">
              {renderCode(iframeCode, 'html')}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* 8. Preview */}
      <div className="rounded-xl bg-card/50 backdrop-blur-sm p-6 border border-border/50">
        <h2 className="text-2xl font-semibold mb-4">Preview</h2>
        <div className="flex flex-col items-center space-y-4">
          <ChatbotPreview
            color={color}
            selectedIcon={
              customIcon ? (
                <img src={customIcon} alt="Custom Icon" className="w-6 h-6" />
              ) : (
                icons.find((icon) => icon.id === selectedIcon)?.component
              )
            }
            buttonAlignment={buttonAlignment}
            showButtonText={showButtonText}
            buttonText={widgetButtonText}
            welcomeMessage={welcomeMessage}
            displayStyle={displayStyle}
            customIcon={customIcon}
            starterQuestions={starterQuestions}
            HeaderText={widgetHeader}
          />
          {/* Widget Button Preview */}
          <div className="relative h-[100px] w-full border rounded-lg bg-gray-50 dark:bg-gray-800 flex items-end">
            <div
              className={`absolute bottom-4 ${
                buttonAlignment === 'right' ? 'right-4' : 'left-4'
              } flex items-center gap-2`}
            >
              {customIcon ? (
                <img src={customIcon} alt="Custom Icon" className="w-6 h-6" />
              ) : (
                icons.find((icon) => icon.id === selectedIcon)?.component
              )}
              {showButtonText && <span>{widgetButtonText}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
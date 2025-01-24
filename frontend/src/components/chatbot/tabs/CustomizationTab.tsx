'use client';
import { useState, useEffect } from 'react';
import { ChromePicker } from 'react-color';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Bot, MessageCircle, HelpCircle, MessageSquare, BrainCircuit, CopyIcon, Copy, Minus, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ChatbotPreview } from '@/components/chatbot/ChatbotPreview';
import { Highlight, themes } from 'prism-react-renderer';
// import { Switch } from "@/components/ui/switch";

interface CustomizationTabProps {
  chatbotId: string;
}

export function CustomizationTab({ chatbotId }: CustomizationTabProps) {
  const { toast } = useToast();
  const [color, setColor] = useState('#569CCE');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string>('chat');
  const [buttonAlignment, setButtonAlignment] = useState<'left' | 'right'>('right');
  const [showButtonText, setShowButtonText] = useState(false);
  const [buttonText, setButtonText] = useState('Chat with us');
  const [widgetButtonText, setWidgetButtonText] = useState('Chat with us');
  const [domains, setDomains] = useState(['']);
  const [welcomeMessage, setWelcomeMessage] = useState('Hi! How can I help you today? 👋');
  const [chatHeight, setChatHeight] = useState('500px');
  const [chatWidth, setChatWidth] = useState('350px');
  const [displayStyle, setDisplayStyle] = useState<'corner' | 'overlay'>('corner');
  const [customIcon, setCustomIcon] = useState<string | null>(null);
  const [starterQuestions, setStarterQuestions] = useState<string[]>([
    "What is this about?",
    "How do I get started?",
    "",
    ""
  ]);
  const [widgetHeader, setWidgetHeader] = useState('Support Bot');

  const icons = [
    { id: 'chat', component: <MessageCircle className="w-6 h-6" /> },
    { id: 'bot', component: <Bot className="w-6 h-6" /> },
    { id: 'brain', component: <BrainCircuit className="w-6 h-6" /> },
    { id: 'help', component: <HelpCircle className="w-6 h-6" /> },
    { id: 'message', component: <MessageSquare className="w-6 h-6" /> },
  ];

  const embedCode = `<script>
  (function () {
    const botConfig = {
      botId: "${chatbotId}",
      color: "${color}",
      title: "Support Bot",
      welcomeMessage: "${welcomeMessage}",
      headerText: "${widgetHeader}",
      apiUrl : "https://my0jhajg7c.execute-api.ap-southeast-1.amazonaws.com",
      buttonAlign: "${buttonAlignment}",
      buttonText: "${widgetButtonText}",
      height: "${chatHeight}",
      width: "${chatWidth}",
      displayStyle: "${displayStyle}",
      customIcon: ${customIcon ? `"${customIcon}"` : 'null'},
      starter_questions: ${JSON.stringify(starterQuestions.filter(q => q))},
    };
    const script = document.createElement("script");
    script.src = "https://cloud-ide-shas.s3.us-east-1.amazonaws.com/docBot/chat.js";
    script.async = true;
    script.onload = () => {
      if (window.DocsBotAI) {window.DocsBotAI.init(botConfig);}};
    document.head.appendChild(script);
  })();
</script>
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
`;

  const iframeCode = `<iframe
    src="https://yourdomain.com/chatbot/${chatbotId}"
    width="100%"
    height="600px"
    frameborder="0"
  ></iframe>`;

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
    <Highlight
      theme={themes.nightOwl}
      code={code.trim()}
      language={language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre 
          className="p-3 rounded-lg text-xs overflow-x-auto whitespace-pre" 
          style={{ 
            ...style,
            maxWidth: '100%' // Ensure pre doesn't exceed container
          }}
        >
          {tokens.map((line, i) => (
            <div 
              key={i} 
              {...getLineProps({ line })}
              className="whitespace-pre" // Prevent line wrapping
            >
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

  // Function to handle image upload and convert to base64
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
    <div className="flex gap-4">
      <div className="flex-1 space-y-4">
        {/* Embed Code Section */}
        <div className="space-y-2">
          <h2 className="text-base font-semibold">Chat Widget Embed Code</h2>
          
          {/* Script Code Block */}
          <div className="relative border rounded-lg max-w-[1000px]"> {/* Fixed width container */}
            <div className="overflow-x-auto"> {/* Scrollable wrapper */}
              {renderCode(embedCode, 'javascript')}
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-2 right-2"
              onClick={() => copyToClipboard(embedCode, 'embed')}
            >
              <CopyIcon className="w-4 h-4" />
            </Button>
          </div>

          {/* iFrame Code Block */}
          <div className="relative border rounded-lg max-w-[1000px]"> {/* Fixed width container */}
            <div className="overflow-x-auto"> {/* Scrollable wrapper */}
              {renderCode(iframeCode, 'html')}
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-2 right-2"
              onClick={() => copyToClipboard(iframeCode, 'iframe')}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Customization Options */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold">Customize Widget</h2>
          
          {/* Color Picker */}
          <div className="space-y-1">
            <label className="block text-xs font-medium">Widget Color</label>
            <div className="relative">
              <div
                className="w-full h-8 rounded-md border cursor-pointer"
                style={{ backgroundColor: color }}
                onClick={() => setShowColorPicker(!showColorPicker)}
              />
              {showColorPicker && (
                <div className="absolute z-10 mt-2">
                  <ChromePicker
                    color={color}
                    onChange={(color: { hex: string }) => setColor(color.hex)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Icon Selection */}
          <div className="space-y-1">
            <label className="block text-xs font-medium">Button Icon</label>
            <div className="flex gap-1">
              {icons.map((icon) => (
                <button
                  key={icon.id}
                  onClick={() => setSelectedIcon(icon.id)}
                  className={`p-1.5 rounded-full ${
                    selectedIcon === icon.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                >
                  {icon.component}
                </button>
              ))}
            </div>
          </div>

          {/* Button Alignment */}
          <div className="space-y-1">
            <label className="block text-xs font-medium">Button Alignment</label>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={buttonAlignment === 'left' ? 'default' : 'outline'}
                onClick={() => setButtonAlignment('left')}
              >
                Left
              </Button>
              <Button
                size="sm"
                variant={buttonAlignment === 'right' ? 'default' : 'outline'}
                onClick={() => setButtonAlignment('right')}
              >
                Right
              </Button>
            </div>
          </div>

          {/* Button Text */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium">Show Button Text</label>
              <input
                type="checkbox"
                checked={showButtonText}
                onChange={(e) => setShowButtonText(e.target.checked)}
              />
            </div>
            {showButtonText && (
              <Input
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                placeholder="Enter button text"
                className="h-8 text-sm"
              />
            )}
          </div>

          {/* Welcome Message */}
          <div className="space-y-1">
            <label className="block text-xs font-medium">Welcome Message</label>
            <Textarea
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              placeholder="Enter the first message users will see"
              className="h-20 text-sm resize-none"
            />
          </div>

           {/* Header Message */}
           <div className="space-y-1">
            <label className="block text-xs font-medium">Header Text</label>
            <Textarea
              value={widgetHeader}
              onChange={(e) => setWidgetHeader(e.target.value)}
              placeholder="Enter the Title of chatbot users will see"
              className="h-8 text-sm"
            />
          </div>

          {/* Widget Button Text */}
          <div className="space-y-1">
            <label className="block text-xs font-medium">Widget Button Text</label>
            <Input
              value={widgetButtonText}
              onChange={(e) => setWidgetButtonText(e.target.value)}
              placeholder="Chat with us"
              className="h-8 text-sm"
            />
          </div>

          {/* Allowed Domains */}
          <div className="space-y-1">
            <label className="block text-xs font-medium">Allowed Domains</label>
            {domains.map((domain, index) => (
              <div key={index} className="flex gap-1">
                <Input
                  value={domain}
                  onChange={(e) => handleDomainChange(index, e.target.value)}
                  placeholder="example.com"
                  className="h-8 text-sm"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveDomain(index)}
                  className="h-8 w-8"
                >
                  -
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddDomain}
              className="mt-1"
            >
              <Minus className="w-3 h-3 mr-1" /> Add Domain
            </Button>
          </div>

          {/* Chat Size Controls */}
          <div className="space-y-1">
            <label className="block text-xs font-medium">Chat Widget Size</label>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs text-gray-500">Width</label>
                <Input
                  type="text"
                  value={chatWidth}
                  onChange={(e) => setChatWidth(e.target.value)}
                  placeholder="350px"
                  className="h-8 text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-500">Height</label>
                <Input
                  type="text"
                  value={chatHeight}
                  onChange={(e) => setChatHeight(e.target.value)}
                  placeholder="500px"
                  className="h-8 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Display Style Selection */}
          <div className="space-y-1">
            <label className="block text-xs font-medium">Widget Display Style</label>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={displayStyle === 'corner' ? 'default' : 'outline'}
                onClick={() => setDisplayStyle('corner')}
              >
                Corner
              </Button>
              <Button
                size="sm"
                variant={displayStyle === 'overlay' ? 'default' : 'outline'}
                onClick={() => setDisplayStyle('overlay')}
              >
                Overlay
              </Button>
            </div>
          </div>

          {/* Custom Icon Upload */}
          <div className="space-y-1">
            <label className="block text-xs font-medium">Custom Icon</label>
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleIconUpload}
                  className="hidden"
                  id="icon-upload"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => document.getElementById('icon-upload')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Icon
                </Button>
              </div>
              {customIcon && (
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img src={customIcon} alt="Custom icon" className="w-full h-full object-cover" />
                </div>
              )}
              {customIcon && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setCustomIcon(null)}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>

          {/* Starter Questions */}
          <div className="space-y-1">
            <label className="block text-xs font-medium">Starter Questions (up to 4)</label>
            {starterQuestions.map((question, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={question}
                  onChange={(e) => {
                    const newQuestions = [...starterQuestions];
                    newQuestions[index] = e.target.value;
                    setStarterQuestions(newQuestions);
                  }}
                  placeholder={`Starter question ${index + 1}`}
                  className="h-8 text-sm"
                />
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Preview Section - Fixed width */}
      <div className="w-[450px] h-[600px] space-y-2">
        <h2 className="text-base font-semibold">Preview</h2>
        <ChatbotPreview
          color={color}
          selectedIcon={icons.find((icon) => icon.id === selectedIcon)?.component}
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
        <div className="relative h-[100px] border rounded-lg bg-gray-50 dark:bg-gray-800">
          <div
            className={`absolute bottom-4 ${
              buttonAlignment === 'right' ? 'right-4' : 'left-4'
            }`}
          >
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-full shadow-lg"
              style={{ backgroundColor: color, color: '#fff' }}
            >
              {icons.find((icon) => icon.id === selectedIcon)?.component}
              {showButtonText && <span>{buttonText}</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
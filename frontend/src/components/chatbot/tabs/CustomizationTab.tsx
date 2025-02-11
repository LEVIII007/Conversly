'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
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
  Palette,
  Settings2,
  Layout,
  Globe,
  ListPlus,
  Sparkles,
  Plus,
  LucideIcon
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { useToast } from '@/hooks/use-toast';
import { ChatbotPreview } from '@/components/chatbot/ChatbotPreview';
import { Highlight, themes } from 'prism-react-renderer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface CustomizationTabProps {
  chatbotId: string;
  prompt: string;
}

/** 
 * A central interface for all chatbot configuration,
 * making it easier to store and manage the entire config in a single object. 
 */
interface ChatbotConfig {
  color: string;
  widgetHeader: string;
  welcomeMessage: string;
  promptscript: string;
  selectedIcon: string;
  customIcon: string | null;
  buttonAlignment: 'left' | 'right';
  showButtonText: boolean;
  widgetButtonText: string;
  chatWidth: string;
  chatHeight: string;
  displayStyle: 'corner' | 'overlay';
  domains: string[];
  starterQuestions: string[];
}

function SectionHeader({ 
  title, 
  description,
  icon: Icon 
}: { 
  title: string; 
  description?: string;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10">
          <Icon className="w-5 h-5 text-pink-500" />
        </div>
        <div>
          <h2 className="font-heading text-xl font-semibold text-white">
            {title}
          </h2>
          {description && (
            <p className="font-sans text-base text-gray-400">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export function CustomizationTab({ chatbotId, prompt }: CustomizationTabProps) {
  const { toast } = useToast();

  // Icons array remains constant; no need to store in state
  const icons = [
    { id: 'chat', component: <MessageCircle className="w-6 h-6" /> },
    { id: 'bot', component: <Bot className="w-6 h-6" /> },
    { id: 'brain', component: <BrainCircuit className="w-6 h-6" /> },
    { id: 'help', component: <HelpCircle className="w-6 h-6" /> },
    { id: 'message', component: <MessageSquare className="w-6 h-6" /> },
  ];

  /**
   * A single piece of state (`config`) holding all the settings 
   * instead of multiple separate useState hooks.
   */
  const [config, setConfig] = useState<ChatbotConfig>({
    color: '#0e4b75',
    widgetHeader: 'Support Bot',
    welcomeMessage: 'Hi! How can I help you today? 👋',
    promptscript: prompt,
    selectedIcon: 'chat',
    customIcon: null,
    buttonAlignment: 'right',
    showButtonText: false,
    widgetButtonText: 'Chat with us',
    chatWidth: '350px',
    chatHeight: '500px',
    displayStyle: 'corner',
    domains: [''],
    starterQuestions: ['What is this about?', 'How do I get started?', '', ''],
  });

  /** Helper to update config without rewriting the entire object each time. */
  const updateConfig = (updates: Partial<ChatbotConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  /** Domain management */
  const handleAddDomain = () => {
    updateConfig({ domains: [...config.domains, ''] });
  };

  const handleDomainChange = (index: number, value: string) => {
    const newDomains = [...config.domains];
    newDomains[index] = value;
    updateConfig({ domains: newDomains });
  };

  const handleRemoveDomain = (index: number) => {
    const newDomains = config.domains.filter((_, i) => i !== index);
    updateConfig({ domains: newDomains });
  };

  /** Starter questions management */
  const handleStarterQuestionChange = (index: number, value: string) => {
    const newQuestions = [...config.starterQuestions];
    newQuestions[index] = value;
    updateConfig({ starterQuestions: newQuestions });
  };

  const handleAddStarterQuestion = () => {
    updateConfig({ starterQuestions: [...config.starterQuestions, ''] });
  };

  /** File upload helper to convert icon to base64 */
  const handleIconUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        updateConfig({
          customIcon: base64String,
          selectedIcon: '',
        });
      };
      reader.readAsDataURL(file);
    }
  };

  /** Copy code to clipboard */
  const copyToClipboard = (text: string, type: 'embed' | 'iframe') => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: `${type === 'embed' ? 'Widget' : 'iframe'} code copied to clipboard`,
    });
  };

  /** Prism highlight helper */
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

  /** 
   * Embed code using the config object. 
   * Notice we read from `config` instead of multiple variables.
   */
  const embedCode = `<script>
(function () {
  const botConfig = {
    botId: "${chatbotId}",
    color: "${config.color}",
    title: "${config.widgetHeader}",
    welcomeMessage: "${config.welcomeMessage}",
    headerText: "${config.widgetHeader}",
    apiUrl: "https://my0jhajg7c.execute-api.ap-southeast-1.amazonaws.com",
    buttonAlign: "${config.buttonAlignment}",
    buttonText: "${config.widgetButtonText}",
    height: "${config.chatHeight}",
    width: "${config.chatWidth}",
    displayStyle: "${config.displayStyle}",
    customIcon: ${config.customIcon ? `"${config.customIcon}"` : 'null'},
    starter_questions: ${JSON.stringify(
      config.starterQuestions.filter((q) => q.trim() !== '')
    )},
    prompt: "${config.promptscript}"
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

  return (
    <TooltipProvider>
      <div className="space-y-8">
        {/* Introduction */}
        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/60 rounded-2xl p-6">
          <h2 className="font-heading text-2xl text-white mb-2">
            Widget Customization
          </h2>
          <p className="font-sans text-base text-gray-400">
            Customize your chatbot's appearance and behavior to match your website.
          </p>
        </div>

        {/* Main Settings Tabs */}
        <Tabs defaultValue="appearance" className="space-y-6">
          <TabsList className="bg-gray-900/60 p-1 rounded-xl">
            <TabsTrigger 
              value="appearance" 
              className="font-sans text-base data-[state=active]:bg-gradient-to-r from-pink-500 to-purple-500 data-[state=active]:text-white"
            >
              <Palette className="w-4 h-4 mr-2" />
              Appearance
            </TabsTrigger>
            <TabsTrigger 
              value="behavior" 
              className="font-sans text-base data-[state=active]:bg-gradient-to-r from-pink-500 to-purple-500 data-[state=active]:text-white"
            >
              <Settings2 className="w-4 h-4 mr-2" />
              Behavior
            </TabsTrigger>
            <TabsTrigger 
              value="integration" 
              className="font-sans text-base data-[state=active]:bg-gradient-to-r from-pink-500 to-purple-500 data-[state=active]:text-white"
            >
              <Code className="w-4 h-4 mr-2" />
              Integration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appearance">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Theme Settings */}
              <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/60 rounded-2xl p-6">
                <SectionHeader 
                  title="Theme Settings" 
                  description="Customize the visual appearance of your widget"
                  icon={Palette}
                />
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Color Picker */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="font-sans text-base text-gray-300">Theme Color</label>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="w-4 h-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-sans text-sm">
                            This color will be used for the widget's header, buttons, and accents
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="flex gap-4">
                      <Input
                        type="color"
                        value={config.color}
                        onChange={(e) => updateConfig({ color: e.target.value })}
                        className="w-16 h-10 p-1 rounded-lg cursor-pointer bg-gray-800/50 border-gray-700/50"
                      />
                      <Input
                        value={config.color}
                        onChange={(e) => updateConfig({ color: e.target.value })}
                        placeholder="#000000"
                        className="flex-1 bg-gray-800/50 border-gray-700/50 text-white"
                      />
                    </div>
                  </div>

                  {/* Header Text */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="font-sans text-base text-gray-300">Widget Header</label>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="w-4 h-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-sans text-sm">
                            The title shown at the top of your chat widget
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input
                      value={config.widgetHeader}
                      onChange={(e) => updateConfig({ widgetHeader: e.target.value })}
                      placeholder="Support Bot"
                      className="bg-gray-800/50 border-gray-700/50 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Icon Settings */}
              <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/60 rounded-2xl p-6">
                <SectionHeader 
                  title="Icon Settings" 
                  description="Choose or upload a custom icon for your chat widget"
                  icon={Layout}
                />
                
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-4">
                    {icons.map((icon) => (
                      <Button
                        key={icon.id}
                        variant={config.selectedIcon === icon.id && !config.customIcon ? 'default' : 'outline'}
                        onClick={() => updateConfig({ selectedIcon: icon.id, customIcon: null })}
                        className="p-3 bg-gray-800/50 border-gray-700/50 hover:bg-gray-700/50"
                      >
                        {icon.component}
                      </Button>
                    ))}
                    <div className="flex items-center gap-2">
                      <label 
                        htmlFor="customIconUpload" 
                        className="cursor-pointer p-3 rounded-xl border border-gray-700/50 hover:bg-gray-700/50 transition-colors"
                      >
                        <Upload className="w-6 h-6 text-gray-400" />
                      </label>
                      <input
                        id="customIconUpload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleIconUpload}
                      />
                      {config.customIcon && (
                        <img src={config.customIcon} alt="Custom Icon" className="w-10 h-10 rounded-lg object-contain" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-400">
                    <HelpCircle className="w-4 h-4" />
                    <p className="font-sans text-sm">
                      Select a preset icon or upload your own. Custom icons will override presets.
                    </p>
                  </div>
                </div>
              </div>

              {/* Size & Position */}
              <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/60 rounded-2xl p-6">
                <SectionHeader 
                  title="Size & Position" 
                  description="Configure the dimensions and placement of your widget"
                  icon={Frame}
                />
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="font-sans text-base text-gray-300 mb-2 block">Widget Width</label>
                      <Input
                        value={config.chatWidth}
                        onChange={(e) => updateConfig({ chatWidth: e.target.value })}
                        placeholder="e.g., 350px"
                        className="bg-gray-800/50 border-gray-700/50 text-white"
                      />
                    </div>
                    <div>
                      <label className="font-sans text-base text-gray-300 mb-2 block">Widget Height</label>
                      <Input
                        value={config.chatHeight}
                        onChange={(e) => updateConfig({ chatHeight: e.target.value })}
                        placeholder="e.g., 500px"
                        className="bg-gray-800/50 border-gray-700/50 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="font-sans text-base text-gray-300 mb-2 block">Display Style</label>
                    <div className="flex items-center gap-4">
                      <Button
                        variant={config.displayStyle === 'corner' ? 'default' : 'outline'}
                        onClick={() => updateConfig({ displayStyle: 'corner' })}
                        className="bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:opacity-90"
                      >
                        Corner
                      </Button>
                      <Button
                        variant={config.displayStyle === 'overlay' ? 'default' : 'outline'}
                        onClick={() => updateConfig({ displayStyle: 'overlay' })}
                        className="border-gray-700 text-white hover:bg-gray-700/50"
                      >
                        Overlay
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Button Settings */}
              <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/60 rounded-2xl p-6">
                <SectionHeader 
                  title="Button Settings" 
                  description="Customize the chat button appearance"
                  icon={MessageSquare}
                />
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <label className="font-sans text-base text-gray-300">Button Alignment</label>
                    <div className="flex items-center gap-4">
                      <Button
                        variant={config.buttonAlignment === 'left' ? 'default' : 'outline'}
                        onClick={() => updateConfig({ buttonAlignment: 'left' })}
                        className={config.buttonAlignment === 'left' 
                          ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:opacity-90"
                          : "border-gray-700 text-white hover:bg-gray-700/50"
                        }
                      >
                        Left
                      </Button>
                      <Button
                        variant={config.buttonAlignment === 'right' ? 'default' : 'outline'}
                        onClick={() => updateConfig({ buttonAlignment: 'right' })}
                        className={config.buttonAlignment === 'right' 
                          ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:opacity-90"
                          : "border-gray-700 text-white hover:bg-gray-700/50"
                        }
                      >
                        Right
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <label className="font-sans text-base text-gray-300">Show Button Text</label>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="w-4 h-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-sans text-sm">Display text next to the chat button</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.showButtonText}
                      onChange={(e) => updateConfig({ showButtonText: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-700 bg-gray-800/50"
                    />
                  </div>

                  {config.showButtonText && (
                    <div className="space-y-2">
                      <label className="font-sans text-base text-gray-300">Button Text</label>
                      <Input
                        value={config.widgetButtonText}
                        onChange={(e) => updateConfig({ widgetButtonText: e.target.value })}
                        placeholder="Chat with us"
                        className="bg-gray-800/50 border-gray-700/50 text-white"
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="behavior">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Welcome Message */}
              <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/60 rounded-2xl p-6">
                <SectionHeader 
                  title="Welcome Message" 
                  description="Set the initial message users see when opening the chat"
                  icon={MessageSquare}
                />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="font-sans text-base text-gray-300">Initial Message</label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-sans text-sm">This message appears when a user first opens the chat</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Textarea
                    value={config.welcomeMessage}
                    onChange={(e) => updateConfig({ welcomeMessage: e.target.value })}
                    placeholder="Hi! How can I help you today? 👋"
                    className="bg-gray-800/50 border-gray-700/50 text-white min-h-[100px]"
                  />
                </div>
              </div>

              {/* Prompt Script */}
              <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/60 rounded-2xl p-6">
                <SectionHeader 
                  title="System Prompt" 
                  description="Define your assistant's personality and behavior"
                  icon={BrainCircuit}
                />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="font-sans text-base text-gray-300">Prompt Script</label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-sans text-sm">This script defines how your AI assistant behaves and responds</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Textarea
                    value={config.promptscript}
                    onChange={(e) => updateConfig({ promptscript: e.target.value })}
                    placeholder="You are a helpful assistant..."
                    className="bg-gray-800/50 border-gray-700/50 text-white min-h-[200px]"
                  />
                </div>
              </div>

              {/* Starter Questions */}
              <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/60 rounded-2xl p-6">
                <SectionHeader 
                  title="Starter Questions" 
                  description="Suggest questions to help users get started"
                  icon={ListPlus}
                />
                
                <div className="space-y-4">
                  {config.starterQuestions.map((question, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Input
                        value={question}
                        onChange={(e) => handleStarterQuestionChange(index, e.target.value)}
                        placeholder={`Suggestion ${index + 1}`}
                        className="bg-gray-800/50 border-gray-700/50 text-white"
                      />
                      {index >= 2 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const newQuestions = config.starterQuestions.filter((_, i) => i !== index);
                            updateConfig({ starterQuestions: newQuestions });
                          }}
                          className="text-gray-400 hover:text-white hover:bg-gray-700"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    onClick={handleAddStarterQuestion}
                    variant="outline"
                    className="w-full border-gray-700 text-white hover:bg-gray-700/50"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Question
                  </Button>
                </div>
              </div>

              {/* Allowed Domains */}
              <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/60 rounded-2xl p-6">
                <SectionHeader 
                  title="Allowed Domains" 
                  description="Control which websites can embed your chatbot"
                  icon={Globe}
                />
                
                <div className="space-y-4">
                  {config.domains.map((domain, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Input
                        value={domain}
                        onChange={(e) => handleDomainChange(index, e.target.value)}
                        placeholder="https://example.com"
                        className="bg-gray-800/50 border-gray-700/50 text-white"
                      />
                      {config.domains.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveDomain(index)}
                          className="text-gray-400 hover:text-white hover:bg-gray-700"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    onClick={handleAddDomain}
                    variant="outline"
                    className="w-full border-gray-700 text-white hover:bg-gray-700/50"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Domain
                  </Button>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="integration">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Integration Code */}
              <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/60 rounded-2xl p-6">
                <SectionHeader 
                  title="Widget Code" 
                  description="Add this code to your website to embed the chatbot"
                  icon={Code}
                />
                
                <Tabs defaultValue="script" className="space-y-4">
                  <TabsList className="bg-gray-800/50 p-1 rounded-xl">
                    <TabsTrigger value="script" className="font-sans text-base">
                      Script Tag
                    </TabsTrigger>
                    <TabsTrigger value="iframe" className="font-sans text-base">
                      iframe
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="script">
                    <div className="relative">
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute right-2 top-2 border-gray-700 text-white hover:bg-gray-700/50"
                        onClick={() => copyToClipboard(embedCode, 'embed')}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
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

              {/* Preview */}
              <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/60 rounded-2xl p-6">
                <SectionHeader 
                  title="Live Preview" 
                  description="See how your chatbot will appear on your website"
                  icon={Sparkles}
                />
                
                <div className="mt-6">
                  <ChatbotPreview
                    color={config.color}
                    selectedIcon={
                      config.customIcon ? (
                        <img src={config.customIcon} alt="Custom Icon" className="w-6 h-6" />
                      ) : (
                        icons.find((icon) => icon.id === config.selectedIcon)?.component
                      )
                    }
                    buttonAlignment={config.buttonAlignment}
                    showButtonText={config.showButtonText}
                    buttonText={config.widgetButtonText}
                    welcomeMessage={config.welcomeMessage}
                    displayStyle={config.displayStyle}
                    customIcon={config.customIcon}
                    starterQuestions={config.starterQuestions}
                    HeaderText={config.widgetHeader}
                  />
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
}

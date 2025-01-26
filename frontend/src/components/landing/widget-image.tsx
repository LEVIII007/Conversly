import React from 'react';

const ChatbotImage: React.FC = () => {
    return (
        <div className="hidden md:block md:flex-1 animate__animated animate__fadeInRight">
            <div className="relative">
                {/* Abstract Chat Bubble Shapes */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full filter blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal-400/10 rounded-full filter blur-3xl"></div>
                
                {/* Chat Interface Mockup */}
                <div className="relative bg-neutral-800/50 backdrop-blur-sm p-6 rounded-2xl border border-neutral-700 shadow-2xl">
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-gray-300">AI Assistant Online</span>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-neutral-700/50 p-3 rounded-lg text-gray-300 max-w-xs ml-auto">
                                How can I help you today?
                            </div>
                            <div className="flex items-end">
                                <div className="bg-blue-500/20 p-3 rounded-lg text-blue-300 max-w-xs">
                                    I'd like to create a custom chatbot for my website.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatbotImage;
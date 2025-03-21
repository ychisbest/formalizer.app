import { useState, useRef, useEffect } from 'react';

const DemoSection = () => {
    const [inputText, setInputText] = useState("Hey there! Just wanted to let u know that I'm gonna be late for the meeting tmrw. Traffic is crazy and I gotta drop my kids off first. Let's push it back 30 mins? Thx!");
    const [outputText, setOutputText] = useState("");
    const [suggestions, setSuggestions] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const textareaRef = useRef(null);

    const formalizeText = async () => {
        if (!inputText.trim() || isGenerating) return;

        setIsGenerating(true);
        setOutputText("");
        setSuggestions("");

        try {
            const response = await fetch('https://ai.ych.show', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ych'
                },
                body: JSON.stringify({
                    model: "random",
                    stream: true,
                    messages: [
                        {
                            role: "system",
                            content: `
 You are a formalizer. Your task is to transform informal text into a more formal version.don't use paper format.reply be short and concise.

 response format:
Revised Text|||Revision Rationale

For example:
I send you

"Hey, can you send me the report?"

you should respond with:
"Could you please send me the report?"||| "can you send me" is informal and should be replaced with "Could you please send me".

                    `
                        },
                        {
                            role: "user",
                            content: inputText
                        }
                    ]
                }),
            });

            if (!response.body) {
                throw new Error('ReadableStream not supported');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullResponse = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data:') && !line.includes('[DONE]')) {
                        try {
                            const data = JSON.parse(line.substring(5));
                            if (data.choices && data.choices[0]?.delta?.content) {
                                fullResponse += data.choices[0].delta.content;
                                
                                // Parse for the format: "修改后的文本|||修改建议"
                                const parts = fullResponse.split('|||');
                                if (parts.length >= 1) {
                                    setOutputText(parts[0].trim());
                                }
                                if (parts.length >= 2) {
                                    setSuggestions(parts[1].trim());
                                }
                            }
                        } catch (e) {
                            // Skip invalid JSON
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error formalizing text:', error);
            setOutputText("Sorry, there was an error formalizing your text. Please try again later.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleTryYourOwn = () => {
        setIsEditing(true);
        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
            }
        }, 0);
    };

    const copyToClipboard = (text) => {
        if (text) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000);
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                });
        }
    };

    return (
        <section id='core' className="bg-gray-50 px-6 py-20">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
                    See The Transformation
                </h2>

                <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
                    <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                        <div className="p-6 transition-all duration-300 hover:bg-gray-50">
                            <h3 className="text-lg font-medium text-gray-900 mb-3">
                                Before
                            </h3>
                            {isEditing ? (
                                <div className='pb-4 h-full'>
                                    <textarea
                                        ref={textareaRef}
                                        className="w-full h-full min-h-[12rem] resize-none focus:border-transparent focus:outline-none p-2 border-none border-gray-300 rounded text-gray-700 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        placeholder="Enter your informal text here..."
                                    />
                                </div>
                            ) : (
                                <p className="text-gray-700 mb-4 min-h-[12rem]">
                                    {inputText}
                                </p>
                            )}
                        </div>
                        <div className="p-6 bg-blue-50 transition-all duration-300 hover:bg-blue-100">
                            <h3 className="text-lg font-medium text-gray-900 mb-3 flex justify-between items-center">
                                <span>After Formalizer</span>
                                {outputText && (
                                    <button
                                        onClick={() => copyToClipboard(outputText)}
                                        className={`text-sm flex items-center px-2 py-1 rounded-md transition-all duration-200 ${
                                            isCopied 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-800'
                                        }`}
                                    >
                                        {isCopied ? (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                                </svg>
                                                Copy
                                            </>
                                        )}
                                    </button>
                                )}
                            </h3>
                            <div className="text-gray-700 mb-4 min-h-[12rem] bg-white p-3 rounded-md shadow-sm overflow-auto transition-all duration-200">
                                {isGenerating ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="animate-pulse flex space-x-2">
                                            <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                                            <div className="h-2 w-2 bg-blue-400 rounded-full animation-delay-200"></div>
                                            <div className="h-2 w-2 bg-blue-400 rounded-full animation-delay-400"></div>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="whitespace-pre-wrap">
                                        {outputText || "I regret to inform you that I will be delayed for tomorrow's meeting due to heavy traffic and the need to drop off my children. Would it be possible to reschedule the meeting for 30 minutes later? Thank you for your understanding."}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {suggestions && (
                        <div className="px-6 py-4 bg-yellow-50 border-t border-yellow-100">
                            <h3 className="text-lg font-medium text-gray-900 mb-2 flex justify-between items-center">
                                <span>Suggestions for Improvement</span>
                                <button
                                    onClick={() => copyToClipboard(suggestions)}
                                    className="text-sm flex items-center px-2 py-1 rounded-md transition-all duration-200 bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                    </svg>
                                    Copy Suggestions
                                </button>
                            </h3>
                            <div className="bg-white p-3 rounded-md shadow-sm text-gray-700 whitespace-pre-wrap">
                                {suggestions}
                            </div>
                        </div>
                    )}
                    
                    <div className="bg-gray-50 px-6 py-4 text-center flex justify-center space-x-4">
                        {isEditing ? (
                            <button
                                className={`px-4 py-2 text-white font-medium rounded transition-all duration-300 transform hover:scale-105 ${
                                    isGenerating || !inputText.trim() 
                                        ? 'bg-blue-300 cursor-not-allowed' 
                                        : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md'
                                }`}
                                onClick={formalizeText}
                                disabled={isGenerating || !inputText.trim()}
                            >
                                {isGenerating ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Formalizing...
                                    </span>
                                ) : "Formalize Text"}
                            </button>
                        ) : (
                            <button
                                className="text-blue-600 font-medium hover:text-blue-800 transition-all duration-300 transform hover:scale-105 flex items-center"
                                onClick={handleTryYourOwn}
                            >
                                Try with your own text
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DemoSection;
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
                    temperature: 0.8,
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

    useEffect(() => {
        // Focus on the textarea when component mounts
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    }, []);

    return (
        <section id='core' className="bg-gray-50 pb-16 pt-10 px-4">
            <div className="max-w-6xl mx-auto">
            <h1 className='mb-4 text-xl font-bold mx-auto flex items-center justify-center'>Formalize your Text</h1>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                        {/* Input Section */}
                        <div className="p-8">
                            <h3 className="text-xl font-medium text-gray-900 mb-4">
                                Your Text
                            </h3>
                            <textarea
                                ref={textareaRef}
                                className="w-full h-72 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none p-4 border border-gray-200 rounded-lg text-gray-700"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Enter your informal text here..."
                            />
                        </div>

                        {/* Output Section */}
                        <div className="p-8 bg-blue-50">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-medium text-gray-900">
                                    Formalized Version
                                </h3>
                                {outputText && (
                                    <button
                                        onClick={() => copyToClipboard(outputText)}
                                        className={`flex items-center px-3 py-1.5 rounded-md transition-all ${
                                            isCopied 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'bg-blue-200 text-blue-700 hover:bg-blue-300'
                                        }`}
                                    >
                                        {isCopied ? "Copied!" : "Copy"}
                                    </button>
                                )}
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm h-72 overflow-auto">
                                {isGenerating ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="flex space-x-2">
                                            <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
                                            <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-75"></div>
                                            <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-150"></div>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="whitespace-pre-wrap text-gray-700">
                                        {outputText || "Your formalized text will appear here."}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {suggestions && (
                        <div className="px-8 py-6 bg-yellow-50 border-t border-yellow-100">
                            <h3 className="text-xl font-medium text-gray-900 mb-3">
                                Suggestions
                            </h3>
                            <div className="bg-white p-4 rounded-lg shadow-sm text-gray-700">
                                {suggestions}
                            </div>
                        </div>
                    )}
                    
                    <div className="p-8 text-center">
                        <button
                            className={`px-6 py-3 text-white font-medium rounded-lg text-lg transition-all ${
                                isGenerating || !inputText.trim() 
                                    ? 'bg-blue-300 cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md'
                            }`}
                            onClick={formalizeText}
                            disabled={isGenerating || !inputText.trim()}
                        >
                            {isGenerating ? "Formalizing..." : "Formalize Text"}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DemoSection;
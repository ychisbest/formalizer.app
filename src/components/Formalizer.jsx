import { useState, useRef, useEffect } from 'react';

const DemoSection = () => {
    const [inputText, setInputText] = useState("Hey there! Just wanted to let u know that I'm gonna be late for the meeting tmrw. Traffic is crazy and I gotta drop my kids off first. Let's push it back 30 mins? Thx!");
    const [outputText, setOutputText] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const textareaRef = useRef(null);

    const formalizeText = async () => {
        if (!inputText.trim() || isGenerating) return;

        setIsGenerating(true);
        setOutputText("");

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
                    You are a professional editor. Rewrite the following informal text into formal, professional language. Keep the same meaning but make it appropriate for business or academic settings.
                    - reply me the language in the same language as the input text.
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
                                setOutputText(prev => prev + data.choices[0].delta.content);
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

    const copyToClipboard = () => {
        if (outputText) {
            navigator.clipboard.writeText(outputText)
                .then(() => {
                    // You could add a state for showing a "Copied!" message
                    console.log('Text copied to clipboard');
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

                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-3">
                                Before
                            </h3>
                            {isEditing ? (
                                <div className=' pb-4 h-full'>
                                    <textarea
                                        ref={textareaRef}
                                        className="w-full h-full resize-none focus:border-transparent focus:outline-none p-2 border-none border-gray-300 rounded text-gray-700"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                    />
                                </div>
                            ) : (
                                <p className="text-gray-700 mb-4">
                                    {inputText}
                                </p>
                            )}
                        </div>
                        <div className="p-6 bg-blue-50">
                            <h3 className="text-lg font-medium text-gray-900 mb-3 flex justify-between items-center">
                                <span>After Formalizer</span>
                                {outputText && (
                                    <button
                                        onClick={copyToClipboard}
                                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                        </svg>
                                        Copy
                                    </button>
                                )}
                            </h3>
                            <p className="text-gray-700 mb-4 min-h-[8rem]">
                                {outputText || "Your formalized text will appear here..."}
                            </p>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-4 text-center flex justify-center space-x-4">
                        {isEditing ? (
                            <button
                                className="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 disabled:bg-blue-300"
                                onClick={formalizeText}
                                disabled={isGenerating || !inputText.trim()}
                            >
                                {isGenerating ? "Formalizing..." : "Formalize Text"}
                            </button>
                        ) : (
                            <button
                                className="text-blue-600 font-medium hover:text-blue-800"
                                onClick={handleTryYourOwn}
                            >
                                Try with your own text →
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DemoSection;
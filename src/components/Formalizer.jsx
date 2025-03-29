import { useState, useRef, useEffect } from 'react';
// Assuming LOCALES is still needed for the 't' function if you keep multi-language support
// import { LOCALES } from "@/i18n";

const DemoSection = ({ lang = 'en' }) => { // Default lang to 'en' if not provided
    const [inputText, setInputText] = useState(() => {
        // Example informal texts in different languages based on selected language
        const exampleTexts = {
            'en': "Hey there! Just wanted to let u know that I'm gonna be late for the meeting tmrw. Traffic is crazy and I gotta drop my kids off first. Let's push it back 30 mins? Thx!",
            'zh-cn': "老王啊，明儿个那会我得晚点到了！路上堵得不行，还得先把娃送学校去。咱往后推半小时行不？先谢啦！",
            'es': "¡Ey! Te aviso que mañana llegaré tarde a la reunión. Hay un tráfico del demonio y tengo que dejar a los niños primero. ¿Podemos retrasarla media hora? ¡Un millón de gracias!",
            'fr': "Salut ! Je te préviens que je serai en retard pour la réunion demain. La circulation est un cauchemar et je dois déposer les gamins d'abord. On décale de 30 minutes ? Merci d'avance !",
            'de': "Hi du! Muss dir Bescheid geben, dass ich's morgen nicht pünktlich zum Meeting schaffe. Verkehr ist die Hölle und ich muss erst die Kinder abliefern. Können wir's um ne halbe Stunde verschieben? Wär super!",
            'ja': "あのさ、明日の会議に遅れそうなんだ。道がめちゃ混んでるし、子供を先に学校に送らないといけなくて。30分遅らせてもらってもいい？助かるよ！",
            'ar': "مرحبا! أردت فقط أن أخبرك أنني سأتأخر عن الاجتماع غدا. حركة المرور جنونية وعلي أن أوصل أطفالي أولا. هل يمكننا تأجيله 30 دقيقة؟ شكرا!",
            'pt': "Ei! Só queria avisar que vou chegar atrasado na reunião amanhã. O trânsito tá um caos e preciso deixar as crianças primeiro. Podemos adiar por meia hora? Valeu!",
            'ru': "Привет! Просто хотел предупредить, что завтра опоздаю на встречу. Пробки сумасшедшие, и мне нужно сначала отвезти детей. Можем перенести на полчаса? Спасибо!"
        };
        
        // Return the example text for the selected language, or default to English
        return exampleTexts[lang] || exampleTexts['en'];
    });
    const [outputText, setOutputText] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const textareaRef = useRef(null);

    // Helper function to translate text based on language (simplified example)
    const t = (texts) => {
        // In a real app, you'd use a proper i18n library or your LOCALES object
        const translations = {
            // Input Section Title
            yourText: { 
            en: "Your Text", 
            "zh-cn": "您的文本", 
            es: "Tu Texto", 
            ar: "نصك",
            pt: "Seu Texto",
            fr: "Votre Texte",
            ru: "Ваш текст",
            ja: "あなたのテキスト"
            },
            inputPlaceholder: { 
            en: "Enter your informal text here...", 
            "zh-cn": "在这里输入您的非正式文本...", 
            es: "Ingrese su texto informal aquí...",
            ar: "أدخل نصك غير الرسمي هنا...",
            pt: "Digite seu texto informal aqui...",
            fr: "Entrez votre texte informel ici...",
            ru: "Введите ваш неформальный текст здесь...",
            ja: "ここにカジュアルな文章を入力してください..."
            },
            // Output Section Title
            formalizedVersion: { 
            en: "Formalized Version", 
            "zh-cn": "正式版本", 
            es: "Versión Formalizada",
            ar: "النسخة الرسمية",
            pt: "Versão Formalizada",
            fr: "Version Formalisée",
            ru: "Формализованная версия",
            ja: "正式バージョン"
            },
            outputPlaceholder: { 
            en: "Your formalized text will appear here.", 
            "zh-cn": "您的正式文本将显示在这里。", 
            es: "Su texto formalizado aparecerá aquí.",
            ar: "سيظهر نصك الرسمي هنا.",
            pt: "Seu texto formalizado aparecerá aqui.",
            fr: "Votre texte formalisé apparaîtra ici.",
            ru: "Ваш формализованный текст появится здесь.",
            ja: "正式なテキストがここに表示されます。"
            },
            // Buttons
            copy: { 
            en: "Copy", 
            "zh-cn": "复制", 
            es: "Copiar",
            ar: "نسخ",
            pt: "Copiar",
            fr: "Copier",
            ru: "Копировать",
            ja: "コピー"
            },
            copied: { 
            en: "Copied!", 
            "zh-cn": "已复制!", 
            es: "¡Copiado!",
            ar: "تم النسخ!",
            pt: "Copiado!",
            fr: "Copié !",
            ru: "Скопировано!",
            ja: "コピー完了!"
            },
            formalize: { 
            en: "Formalize Text", 
            "zh-cn": "格式化文本", 
            es: "Formalizar Texto",
            ar: "تنسيق النص",
            pt: "Formalizar Texto",
            fr: "Formaliser le Texte",
            ru: "Формализовать текст",
            ja: "テキストを正式化"
            },
            formalizing: { 
            en: "Formalizing...", 
            "zh-cn": "正在格式化...", 
            es: "Formalizando...",
            ar: "جاري التنسيق...",
            pt: "Formalizando...",
            fr: "Formalisation...",
            ru: "Формализация...",
            ja: "正式化中..."
            },
            // Error Message
            errorText: { 
            en: "Sorry, an error occurred. Please try again.", 
            "zh-cn": "抱歉，发生错误。请重试。", 
            es: "Lo siento, ocurrió un error. Por favor, inténtalo de nuevo.",
            ar: "عذرا، حدث خطأ. يرجى المحاولة مرة أخرى.",
            pt: "Desculpe, ocorreu um erro. Por favor, tente novamente.",
            fr: "Désolé, une erreur s'est produite. Veuillez réessayer.",
            ru: "Извините, произошла ошибка. Пожалуйста, попробуйте снова.",
            ja: "申し訳ありませんが、エラーが発生しました。もう一度お試しください。"
            },
        };

        // Find the right key based on the first English text provided
        const key = Object.keys(translations).find(k => translations[k]?.en === texts.en);
        return (key && translations[key]?.[lang]) || texts.en; // Default to English
    };

    const formalizeText = async () => {
        if (!inputText.trim() || isGenerating) return;

        setIsGenerating(true);
        setOutputText("");
        setIsCopied(false); // Reset copied state on new generation

        try {
            const response = await fetch('https://ai.ych.show', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ych' // Replace with your actual token handling if needed
                },
                body: JSON.stringify({
                    model: "random", // Consider using a specific model for formalization
                    temperature: 0.7, // Adjusted temperature slightly
                    stream: true,
                    messages: [
                        {
                            role: "system",
                            content: `You are a text formalizer. Convert the user's informal text into a concise, professional, and polite version. Output only the formalized text, without any explanations, suggestions, or preamble. Keep the core meaning intact. Do not use letter/memo formats.`
                        },
                        {
                            role: "user",
                            content: inputText
                        }
                    ]
                }),
            });

            if (!response.ok) {
                 // Handle HTTP errors (e.g., 4xx, 5xx)
                 const errorData = await response.json().catch(() => ({})); // Try to parse error details
                 console.error('API Error:', response.status, errorData);
                 throw new Error(`API request failed with status ${response.status}`);
            }

            if (!response.body) {
                throw new Error('ReadableStream not supported or missing response body');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true }); // Use stream: true for better handling
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data:') && !line.includes('[DONE]')) {
                        try {
                            const data = JSON.parse(line.substring(5).trim()); // Trim potential whitespace
                            if (data.choices && data.choices[0]?.delta?.content) {
                                // Append delta content directly to outputText state
                                setOutputText(prev => prev + data.choices[0].delta.content);
                            }
                        } catch (e) {
                            console.warn('Skipping invalid JSON line:', line, e);
                            // Optionally handle specific JSON parse errors if needed
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error formalizing text:', error);
            setOutputText(t({ en: "Sorry, an error occurred. Please try again." }));
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = () => {
        if (outputText && !isCopied) { // Prevent re-copying immediately
            navigator.clipboard.writeText(outputText)
                .then(() => {
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                    // Optionally show a user-facing error message here
                });
        }
    };

    useEffect(() => {
        // Auto-focus input textarea on mount
        textareaRef.current?.focus();
    }, []);

    // SVG Icons
    const CopyIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 4.875v-4.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.625a1.125 1.125 0 0 0-1.125 1.125v9.75c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125Z" />
        </svg>
    );

    const CheckIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
    );


    return (
        <section id='core' className=" py-12 sm:py-16 px-4">
            <div className="max-w-4xl mx-auto">

                {/* Main Card */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200/80">
                    <div className="grid md:grid-cols-2">

                        {/* Input Column */}
                        <div className="p-6 md:p-8">
                            <h3 className="text-base font-semibold text-gray-500 mb-3 uppercase tracking-wider">
                                {t({ en: "Your Text" })}
                            </h3>
                            <textarea
                                ref={textareaRef}
                                className="w-full h-72 resize-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:outline-none p-4 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 text-sm leading-relaxed shadow-sm transition duration-150 ease-in-out"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder={t({ en: "Enter your informal text here..."})}
                                disabled={isGenerating} // Disable input while generating
                            />
                        </div>

                        {/* Output Column */}
                        {/* Add subtle border for visual separation on larger screens */}
                        <div className="p-6 md:p-8 border-t border-gray-200 md:border-t-0 md:border-l md:border-gray-200/80 relative">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-base font-semibold text-gray-500 uppercase tracking-wider">
                                    {t({ en: "Formalized Version" })}
                                </h3>
                                {outputText && !isGenerating && (
                                    <button
                                        onClick={copyToClipboard}
                                        disabled={isCopied}
                                        className={`flex items-center px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-150 ease-in-out ${isCopied
                                            ? 'bg-green-100 text-green-700 cursor-default'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                                            }`}
                                    >
                                        {isCopied ? <CheckIcon /> : <CopyIcon />}
                                        {isCopied ? t({ en: "Copied!" }) : t({ en: "Copy" })}
                                    </button>
                                )}
                            </div>
                            <div className="w-full h-72 overflow-auto bg-white p-4 border border-gray-300 rounded-lg text-gray-800 text-sm leading-relaxed shadow-sm relative">
                                {isGenerating && !outputText && ( // Show loader only if output is empty
                                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
                                        <div className="flex space-x-1.5">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-75"></div>
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-150"></div>
                                        </div>
                                    </div>
                                )}
                                <p className="whitespace-pre-wrap text-left">
                                    {outputText || (!isGenerating && (
                                        <span className="text-gray-400">{t({ en: "Your formalized text will appear here."})}</span>
                                    ))}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Button Area */}
                    <div className="p-6 text-center border-t border-gray-200/80">
                        <button
                            className={`px-6 py-2.5 text-white font-semibold rounded-lg text-base transition-all duration-150 ease-in-out shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isGenerating || !inputText.trim()
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md'
                                }`}
                            onClick={formalizeText}
                            disabled={isGenerating || !inputText.trim()}
                        >
                            {isGenerating ? t({ en: "Formalizing..." }) : t({ en: "Formalize Text" })}
                        </button>
                    </div>
                </div>

            </div>
        </section>
    );
}

export default DemoSection;
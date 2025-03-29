// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

import type { Multilingual } from "@/i18n";

export const SITE_TITLE: string | Multilingual = "Formalizer";


export const SITE_DESCRIPTION: string | Multilingual = {
	en: "Transform your casual text into formal, professional writing. Enhance your documents, emails, and content with precise language and proper tone.",
	es: "Transforma tu texto informal en una escritura formal y profesional. Mejora tus documentos, correos y contenido con un lenguaje preciso y tono adecuado.",
	ar: "حوّل نصك العادي إلى كتابة رسمية واحترافية. عزز مستنداتك ورسائل البريد الإلكتروني والمحتوى بلغة دقيقة ونبرة مناسبة.",
	pt: "Transforme seu texto casual em escrita formal e profissional. Melhore seus documentos, e-mails e conteúdo com linguagem precisa e tom adequado.",
	fr: "Transformez votre texte décontracté en une écriture formelle et professionnelle. Améliorez vos documents, courriels et contenu avec un langage précis et un ton approprié.",
	ru: "Превратите ваш повседневный текст в формальное, профессиональное письмо. Улучшите ваши документы, письма и контент точным языком и правильным тоном.",
	"zh-cn": "将您的日常文本转化为正式、专业的写作。通过精确的语言和恰当的语调提升您的文档、电子邮件和内容质量。",
	ja: "カジュアルな文章を形式的でプロフェッショナルな文章に変換します。的確な言葉遣いと適切なトーンであなたの文書、メール、コンテンツを向上させます。",
};

export const X_ACCOUNT: string | Multilingual = "@psephopaiktes";

export const NOT_TRANSLATED_CAUTION: string | Multilingual = {
	en: "This page is not available in your language.",
	es: "Esta página no está disponible en tu idioma.",
	ar: "هذه الصفحة غير متوفرة بلغتك.",
	pt: "Esta página não está disponível no seu idioma.",
	fr: "Cette page n'est pas disponible dans votre langue.",
	ru: "Эта страница недоступна на вашем языке.",
	"zh-cn": "此页面不支持您的语言。",
	ja: "このページはご利用の言語でご覧いただけません。",
};

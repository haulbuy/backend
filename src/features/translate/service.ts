const GOOGLE_TRANSLATE_API_KEY = Deno.env.get("GOOGLE_TRANSLATE_API_KEY");
const TRANSLATE_API_URL = `https://translation.googleapis.com/language/translate/v2`;

/**
 * Translates the given text to the target language.
 *
 * @param text The text to translate.
 * @param targetLanguage The target language to translate the text to.
 * @returns The translated text.
 */
async function translateText(
  text: string,
  targetLanguage: string
): Promise<string> {
  const response = await fetch(
    `${TRANSLATE_API_URL}?key=${GOOGLE_TRANSLATE_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
        target: targetLanguage,
      }),
    }
  );

  const data = await response.json();
  return data.data.translations[0].translatedText;
}

/**
 * Translates the given JSON data to the specified target language.
 *
 * This function recursively traverses the JSON data and translates
 * strings, arrays, and objects to the target language.
 *
 * @param data - The JSON data to be translated. It can be a string, array, or object.
 * @param targetLanguage - The language code to which the data should be translated.
 * @returns A promise that resolves to the translated JSON data.
 */
export async function translateJson(
    data: unknown,
    targetLanguage: string
): Promise<unknown> {
    if (typeof data === "string") {
        return translateText(data, targetLanguage);
    } else if (Array.isArray(data)) {
        return Promise.all(data.map(item => translateJson(item, targetLanguage)));
    } else if (typeof data === "object" && data != null) {
        const translatedObject: Record<string, unknown> = {};

        for (const [key, value] of Object.entries(data)) {
            translatedObject[key] = await translateJson(value, targetLanguage);
        }

        return translatedObject;
    }

    return data;
}


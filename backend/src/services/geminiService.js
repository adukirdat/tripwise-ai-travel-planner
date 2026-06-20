const GEMINI_MODEL = "gemini-3.5-flash";
const GEMINI_GENERATE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const typeMap = {
  object: "OBJECT",
  array: "ARRAY",
  string: "STRING",
  integer: "INTEGER",
  number: "NUMBER",
  boolean: "BOOLEAN"
};

const toGeminiResponseSchema = (schema) => {
  if (!schema || typeof schema !== "object") {
    return schema;
  }

  if (Array.isArray(schema)) {
    return schema.map(toGeminiResponseSchema);
  }

  return Object.entries(schema).reduce((geminiSchema, [key, value]) => {
    if (key === "type" && typeof value === "string") {
      geminiSchema[key] = typeMap[value.toLowerCase()] || value;
      return geminiSchema;
    }

    geminiSchema[key] = toGeminiResponseSchema(value);
    return geminiSchema;
  }, {});
};

const parseJsonText = (text) => {
  const trimmedText = text.trim();
  const withoutFence = trimmedText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    const parsedJson = JSON.parse(withoutFence);
    console.log("[Gemini] Parsed JSON response:", JSON.stringify(parsedJson, null, 2));
    return parsedJson;
  } catch {
    throw createError(502, "Gemini returned invalid JSON. Please try again.");
  }
};

const readResponseBody = async (response) => {
  const rawBody = await response.text();
  console.log("[Gemini] Raw response:", rawBody || "<empty response body>");

  if (!rawBody) {
    return {};
  }

  try {
    return JSON.parse(rawBody);
  } catch {
    return { raw: rawBody };
  }
};

const extractCandidateText = (geminiResponse) => {
  const parts = geminiResponse?.candidates?.[0]?.content?.parts;

  if (!Array.isArray(parts)) {
    return "";
  }

  return parts
    .map((part) => (typeof part.text === "string" ? part.text : ""))
    .join("")
    .trim();
};

export const generateStructuredJson = async ({ prompt, schema }) => {
  if (!process.env.GEMINI_API_KEY) {
    throw createError(500, "GEMINI_API_KEY is not configured.");
  }

  const responseSchema = toGeminiResponseSchema(schema);

  try {
    const response = await fetch(GEMINI_GENERATE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          response_mime_type: "application/json",
          response_schema: responseSchema
        }
      })
    });

    const responseBody = await readResponseBody(response);

    if (!response.ok) {
      const message =
        responseBody?.error?.message || "Gemini request failed. Please try again later.";
      throw createError(502, message);
    }

    const generatedText = extractCandidateText(responseBody);

    if (!generatedText) {
      throw createError(502, "Gemini did not return a usable response.");
    }

    return parseJsonText(generatedText);
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }

    throw createError(502, "Unable to reach Gemini. Please try again later.");
  }
};

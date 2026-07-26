import { GoogleGenAI } from "@google/genai";

/**
 * Generates a virtual try-on image.
 * Combines a user's photo with the dress image.
 */
export async function generateTryOn(userImageBase64: string, dressImageUrl: string, dressDescription: string): Promise<string> {
  // Security Update (WS1): Gemini API Key removed from client side.
  // This service must be migrated to a secure server-side endpoint (api/).
  throw new Error("Serviciul Try-On este indisponibil momentan. Așteaptă actualizarea securizată (WS5).");
  
  // Define the exact instruction for the model
  const garmentPrompt = `An elegant photorealistic fashion studio portrait of a woman wearing: ${dressDescription}. The dress perfectly maps to her body.`;

  try {
    // Endpoint for Imagen 3 via Gemini API REST (imageGenerationVideoModel)
    // Note: Free tier might still block this endpoint in EU or require billing activated.
    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`;

    const payload = {
      "instances": [
        {
          "prompt": garmentPrompt
        }
      ],
      "parameters": {
        "sampleCount": 1,
        "aspectRatio": "3:4"
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini Imagen error:", errorText);
      throw new Error("Generarea a eșuat. Verifică limitele planului gratuit The Gemini API sau activează Imagen.");
    }

    const data = await response.json();

    // The API returns base64 images in predictions
    if (data && data.predictions && data.predictions.length > 0) {
      const base64Bytes = data.predictions[0].bytesBase64Encoded;
      if (base64Bytes) {
        return `data:image/jpeg;base64,${base64Bytes}`;
      }
    }

    throw new Error("Răspuns invalid de la modelul Gemini Imagen.");

  } catch (error: any) {
    console.error("Generate TryOn Error:", error);
    throw error;
  }
}

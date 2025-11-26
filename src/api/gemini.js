import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY
})

async function urlToImagePart(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = url.includes("?") ? `${url}&t=${Date.now()}` : `${url}?t=${Date.now()}`;

        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            try {
                const dataURL = canvas.toDataURL("image/jpeg");
                resolve({
                    inlineData: {
                        data: dataURL.split(",")[1],
                        mimeType: "image/jpeg"
                    }
                });
            } catch (e) {
                reject(new Error("Browser blocked image access (CORS)."));
            }
        };

        img.onerror = () => reject(new Error("Failed to load image URL."));
    });
}

async function fileToImagePart(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Data = reader.result.split(",")[1];
            resolve({
                inlineData: {
                    data: base64Data,
                    mimeType: file.type
                }
            });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Act as a professional lost-and-found matching expert.
//      Compare Image A (Lost Item) and Image B (Found Item).
//      Analyze color, shape, brand, and unique features.
//      Strictly return a JSON object with:

// similarity: number (0-100)
// reason: string (concise explanation)

export async function compareItems(originalUrl, foundFile) {

    const imgA = await urlToImagePart(originalUrl)
    const imgB = await fileToImagePart(foundFile)


    const prompt = `Act as a professional lost-and-found matching expert.
     Compare Image A (Lost Item) and Image B (Found Item).
     Analyze color, shape, brand, and unique features.
     Strictly return a JSON object with:
        similarity: number (0-100)
        reason: string (concise explanation)
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{
            role: 'user',
            parts: [
                { text: prompt },
                imgA,
                imgB
            ]
        }],

        config: { responseMimeType: 'application/json' }
    })

    const responseString = response.candidates[0].content.parts[0].text

    return JSON.parse(responseString)

}

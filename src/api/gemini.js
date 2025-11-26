// async function urlToImagePart(url) {
//     return new Promise((resolve, reject) => {
//         const img = new Image();
//         img.crossOrigin = "Anonymous";
//         img.src = url.includes("?") ? ${url}&t=${Date.now()} : ${url}?t=${Date.now()};

//         img.onload = () => {
//             const canvas = document.createElement("canvas");
//             canvas.width = img.width;
//             canvas.height = img.height;
//             const ctx = canvas.getContext("2d");
//             ctx.drawImage(img, 0, 0);

//             try {
//                 const dataURL = canvas.toDataURL("image/jpeg");
//                 resolve({
//                     inlineData: {
//                         data: dataURL.split(",")[1],
//                         mimeType: "image/jpeg"
//                     }
//                 });
//             } catch (e) {
//                 reject(new Error("Browser blocked image access (CORS)."));
//             }
//         };

//         img.onerror = () => reject(new Error("Failed to load image URL."));
//     });
// }

// async function fileToImagePart(file) {
//     return new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.onloadend = () => {
//             const base64Data = reader.result.split(",")[1];
//             resolve({
//                 inlineData: {
//                     data: base64Data,
//                     mimeType: file.type
//                 }
//             });
//         };
//         reader.onerror = reject;
//         reader.readAsDataURL(file);
//     });
// }

export async function compareItems() {}

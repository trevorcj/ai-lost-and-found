# AI Lost & Found Prototype

A simple Lost and Found web app built with React and Tailwind CSS. This project serves as the starter template for the **AI Lost & Found** workshop hosted by [MantaHQ](mantahq.com) in collaboration with **GDG on Campus Ontario Tech University, Oshawa, Canada**.

The goal is to teach students how AI and APIs can work together to solve real problems through a hands-on, beginner friendly build.

## Overview

Users can:

- Upload photos of lost items
- View a public feed
- Compare images to check if an item found by someone matches the lost item
- Receive a similarity score powered by AI
- Complete a short flow to share finder details

The backend portion (MantaHQ SDK) and Gemini AI will be connected live during the workshop.

## Tech Stack

### Frontend

- **React**
- **Tailwind CSS**
- **Cloudinary** for image uploads
- 🚨 **Temporary: TensorFlow JS MobileNet Model** for image similarity
  - **Package:** `@tensorflow-models/mobilenet`
  - **Purpose:** Extracts embeddings from both images and compares them in the browser

## Simulated Authentication

Authentication is simulated using **LocalStorage**:

- The app stores a temporary user session key
- On refresh, the state is restored

## Installation

```bash
git clone https://github.com/trevorcj/ai-lost-and-found.git
cd ai-lost-and-found
npm install
npm run dev
```

---

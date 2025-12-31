# 🚁 File Pilot AI

**File Pilot AI** is a professional-grade intelligent co-pilot for file transformations, digital forensics, and automated workflows. Powered by the **Gemini 3** engine, it provides over 50+ specialized tools for processing documents, images, audio, video, and raw data with high-precision AI analysis.

![Version](https://img.shields.io/badge/version-3.1-blue.svg)
![React](https://img.shields.io/badge/React-19-61DAFB.svg)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF.svg)
![Gemini](https://img.shields.io/badge/AI-Gemini_3-orange.svg)

---

## 🌟 Key Features

- **Document Forensics**: Extract hidden metadata, identify PII, and analyze complex legal contracts.
- **Visual Intelligence**: AI Background removal, ID photo validation, and deepfake detection.
- **Data Engineering**: Intelligent CSV to JSON mapping, XML parsing, and bulk file conversion.
- **Multimedia Units**: Professional transcription, subtitle generation, and video spec optimization.
- **Avionics Dashboard**: Real-time monitoring of network latency, compute load, and system health.
- **Privacy First**: Local-first processing architecture with automated sanitization tools.

---

## 🛠️ Tech Stack

- **Frontend**: React 19 (Hooks, Context, Concurrent Mode)
- **Build Tool**: Vite 6.0 + TypeScript 5.7
- **Styling**: Tailwind CSS (Mobile-first, Glassmorphism, Dark Mode)
- **AI Core**: Google Gemini 3 API (@google/genai)
- **Icons**: Lucide React

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **NPM**: v9.0.0 or higher
- **Gemini API Key**: Obtain one from the [Google AI Studio](https://aistudio.google.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Kmaina32/Toolbox.git
   cd Toolbox
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Variables

The application requires an API key to communicate with the Gemini models. Create a `.env` file in the project root:

```env
API_KEY=your_gemini_api_key_here
```

*Note: In the Vite configuration, `process.env.API_KEY` is mapped to this value during the build process.*

### Local Development

Start the development server:
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

---

## 📦 Deployment & Integration

### Deploying to Vercel (Recommended)

This project is pre-configured for seamless deployment on Vercel.

1.  Push your code to a GitHub repository.
2.  Connect your repository to Vercel.
3.  **Critical**: In the Vercel Dashboard, go to **Project Settings > Environment Variables** and add:
    - `API_KEY`: `your_gemini_api_key_here`
4.  Deploy. The `vercel.json` and `vite.config.ts` will handle the build output and routing automatically.

### Database Connection
For instructions on connecting a database securely, see [DATABASE_GUIDE.md](./DATABASE_GUIDE.md).

---

## 🛡️ Digital Forensics & Safety

File Pilot AI is designed with safety in mind. 
- **PII Protection**: Specialized tools exist specifically to scrub metadata before public sharing.
- **Deterministic Prompting**: System instructions are hardened to prevent data leakage.
- **Local Preview**: Files uploaded for processing are handled via Base64 in-memory buffers.

---

## 📜 License

This project is private and intended for internal tools use. All rights reserved.

---

**File Pilot AI** — *Vectoring Intelligence for the Modern Web.*
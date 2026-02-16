This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features

### 🖼️ Professional Image Editor

A powerful image editing tool with the following capabilities:

- **Crop & Resize** - Crop images to any aspect ratio and dimensions
- **Filters** - Apply professional color filters and adjustments
- **Fine-tune** - Adjust brightness, contrast, saturation, exposure, and more
- **Annotations** - Add text, shapes, arrows, and drawings
- **Stickers** - Decorative stickers and emoji support
- **Frames** - Beautiful frames and borders
- **Redact** - Hide sensitive information with blur/pixelate
- **Decorate** - Overlays and decorative elements
- **Remove Background** - AI-powered background removal using Remove.bg API
- **Export** - Download edited images in various formats

### 🤖 AI Document Chat

- Upload and chat with your documents
- Multi-document conversations
- AI-powered responses

### 🎨 Image Generation

- Generate AI images from text prompts
- Download and save to gallery
- Browse free AI-generated images

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/techbreta/Rag_application_frontend.git
cd Rag_application_frontend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your API keys:

- `NEXT_PUBLIC_API_URL` - Your backend API URL (default: http://localhost:4000)
- `NEXT_PUBLIC_REMOVE_BG_API_KEY` - Your Remove.bg API key for background removal

**Get Remove.bg API Key:**

1. Visit [https://www.remove.bg/api](https://www.remove.bg/api)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Free tier includes 50 API calls per month

### Running the Development Server

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Rag_application_frontend

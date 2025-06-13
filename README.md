# T3 Clone: My Entry for the T3 ChatCloneathon

<p align="center">
  <strong>Because the world needed one more AI chat app. This one comes with all the bells and whistles.</strong>
</p>

<p align="center">
  <a href="https://t3chatclone-seven.vercel.app/"><strong>🚀 View Live Demo</strong></a>
</p>

<p align="center">
  <!-- Placeholder: Replace with a real screenshot of your app -->
  <img src="https://i.imgur.com/3g2aZqL.png" alt="T3 Clone Application Screenshot" width="800"/>
</p>

This repository contains my submission for the **T3 ChatCloneathon**. The brief was "build a cool AI chat app" and "have fun with it." I may have taken the first part a bit too seriously.

This project is a feature-rich, multi-provider AI chat platform built on Next.js, Supabase, and the Vercel AI SDK. It's designed to be a powerful tool, not just another `create-next-app` with an API key.

## ✨ Feature Checklist for the Esteemed Judges

This project was designed to meet all core requirements and then some, because "minimum requirements" is just a suggestion, right?

### Core Requirements

| Requirement | Status | Implementation Notes |
| :--- | :---: | :--- |
| **Chat with Various LLMs** | ✅ | Full support for **70+ models** from **7 providers** via the Vercel AI SDK. The `model` field in the `chats` table lets users pick their poison. |
| **Authentication & Sync** | ✅ | Full user auth via Supabase. All chat history, settings, and attachments are dutifully synced, so users can't escape their questionable prompts. |
| **Browser Friendly** | ✅ | A fully responsive web app that works on modern browsers. No, I did not test it on Internet Explorer. |
| **Easy to Try** | ✅ | Deployed on Vercel with a public URL, so you don't have to wrangle my `node_modules`. A "Bring Your Own Key" model is supported. |

### Bonus Features

| Feature | Status | Implementation Notes |
| :--- | :---: | :--- |
| **Attachment Support** | ✅ | Implemented via Supabase Storage and a dedicated `attachments` table. Yes, you can ask it what's in the PDF. |
| **Chat Sharing** | ✅ | Chats can be made public via a boolean flag, generating a read-only link to show off your brilliant (or horrifying) conversations. |
| **Web Search** | ✅ | The "Wikipedia Search" tool provides integrated, real-time information retrieval. It's like giving the AI a library card. |
| **Bring Your Own Key** | ✅ | The architecture is built for this. Users must provide API keys for the providers they wish to use. My wallet thanks you. |
| **Syntax Highlighting** | ✅ | Implemented to make code snippets readable. Because staring at unformatted code is a form of cruel and unusual punishment. |
| **Anything Else (Creativity)** | ✅ | Several unique features were implemented to make this more than just a wrapper around an API: |
| | | **- Advanced Chat Org:** Pinning, Archiving, and Tagging. For the obsessively organized. |
| | | **- Full Chat Index:** A `chat_index` table stores AI-generated summaries, allowing users to jump to any point in a long conversation. |
| | | **- User Personalization:** A `user_settings` table stores user traits and theme preferences to tailor the experience. |
| **Chat Branching** | 💡 | The "Clone Chat" feature provides a manual way to branch conversations. Because who doesn't love rewriting history? |

## 💻 Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/) 14 (App Router)
*   **AI SDK:** [Vercel AI SDK](https://sdk.vercel.ai/)
*   **Database & Auth:** [Supabase](https://supabase.io/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI:** [React](https://react.dev/), [Lucide Icons](https://lucide.dev/)
*   **Deployment:** [Vercel](https://vercel.com/)

## 🚀 Getting Started: Local Setup

Follow these steps to get a local copy up and running. Or just click the demo link. Your call.

### 1. Prerequisites

*   [Node.js](https://nodejs.org/en) (v18.x or later)
*   [npm](https://www.npmjs.com/) or your preferred package manager
*   A [Supabase](https://supabase.com/) account (The free tier is surprisingly generous)
*   API keys for any AI providers you wish to use.

### 2. Clone the Repository

```bash
git clone https://github.com/your-username/t3-clone.git
cd t3-clone
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Set Up Supabase

1.  Go to your [Supabase Dashboard](https://app.supabase.com/) and click **"New project"**.
2.  Once the project is created, navigate to the **SQL Editor**.
3.  Copy the entire contents of `/schema.sql` and run it. This will build the digital scaffolding for your app.
4.  Navigate to **Project Settings > API** to find the keys for the next step.

### 5. Configure Environment Variables

Create a file named `.env.local` in the root of your project. You only need to provide API keys for the services you intend to use. No need to fund every AI company on the planet just to run this locally.

```env
# .env.local

# --- Supabase Project Credentials (Required) ---
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key # KEEP THIS SECRET, unless you enjoy explaining security breaches.

# --- AI Provider API Keys (Add what you need) ---
# The Vercel AI SDK will automatically pick these up.
GOOGLE_GENERATIVE_AI_API_KEY=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
MISTRAL_API_KEY=
XAI_API_KEY=
DEEPSEEK_API_KEY=
CEREBRAS_API_KEY=
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and witness your creation come to life.

---

## 🗃️ Database Schema Overview

Behold, the blueprint. The full schema is in `/schema.sql`, but here's the gossip on what each table does.

*   `profiles` & `user_settings`: Manages users and their very important theme preferences.
*   `chats`: The star of the show. Holds metadata for each conversation.
*   `messages`: The actual back-and-forth. Where the magic (and nonsense) happens.
*   `attachments`: A digital paperclip for every file a user uploads.
*   `chat_index`: The table of contents for long, rambling chats. A real lifesaver.

## 🌐 Deploy on Vercel

The easiest way to deploy is to use the [Vercel Platform](https://vercel.com/new). Just remember to set your environment variables in the project settings.

## ⚖️ Competition Rules Compliance

*   **Open Source:** This project is licensed under the MIT License. Go nuts.
*   **Team Size:** Developed by [Your Name/Team Names]. We're still on speaking terms.
*   **Content Usage:** I acknowledge that Theo may use this submission for content. Please make my code look good on camera.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
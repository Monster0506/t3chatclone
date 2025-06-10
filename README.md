# T3 Clone: Submission for the T3 ChatCloneathon

<p align="center">
  <strong>A feature-rich, multi-provider AI chat platform built on a modern, scalable stack.</strong>
</p>

<p align="center">
  <a href="https://your-live-demo-url.vercel.app"><strong>🚀 View Live Demo</strong></a>
</p>

<p align="center">
  <!-- Placeholder: Replace with a real screenshot of your app -->
  <img src="https://i.imgur.com/3g2aZqL.png" alt="T3 Clone Application Screenshot" width="800"/>
</p>

This repository contains my submission for the **T3 ChatCloneathon**. The goal was to build a cool, open-source AI chat application that is both powerful for users and easy for developers to understand and extend. This project is built on a modern tech stack featuring Next.js, Supabase, and the **Vercel AI SDK**, providing a unified interface for over **70 models from 7 leading providers**.

## ✨ Feature Checklist for Judges

This project was designed to meet all core requirements and implement several key bonus features to create a superior user experience.

### Core Requirements

| Requirement | Status | Implementation Notes |
| :--- | :---: | :--- |
| **Chat with Various LLMs** | ✅ | Full support for **70+ models** from **7 providers** (Google, OpenAI, Anthropic, Mistral, Grok, DeepSeek, and Llama) via the Vercel AI SDK. The `model` field in the `chats` table allows for dynamic model selection per-chat. |
| **Authentication & Sync** | ✅ | Full user authentication via Supabase Auth. All chat history, settings, and attachments are synced and tied to the user's ID across devices. |
| **Browser Friendly** | ✅ | A fully responsive web application built with Next.js and Tailwind CSS, ensuring a seamless experience on all modern browsers. |
| **Easy to Try** | ✅ | Deployed on Vercel with a public URL. The setup supports a "Bring Your Own Key" model, allowing judges and users to easily test with their own provider API keys. |

### Bonus Features

| Feature | Status | Implementation Notes |
| :--- | :---: | :--- |
| **Attachment Support** | ✅ | Implemented via Supabase Storage and a dedicated `attachments` table, linking files directly to messages. |
| **Chat Sharing** | ✅ | Chats can be made public via a boolean flag in the `chats` table, enabling sharing with a unique, read-only link. |
| **Web Search** | ✅ | The "Wikipedia Search" tool provides integrated real-time information retrieval from a trusted web source. |
| **Bring Your Own Key** | ✅ | The architecture is built for this. Users must provide API keys for the providers they wish to use, which are configured via environment variables. |
| **Anything Else (Creativity)** | ✅ | Several unique features were implemented to enhance usability: |
| | | **- Advanced Chat Org:** Pinning, Archiving, and Tagging (via `metadata` JSONB field). |
| | | **- Full Chat Index:** A `chat_index` table stores AI-generated summaries of key messages, allowing users to jump to any point in a long conversation. |
| | | **- User Personalization:** A `user_settings` table stores user traits, occupation, and theme preferences to tailor the experience. |
| **Syntax Highlighting** | 💡 | Can be implemented on the frontend using a library like `highlight.js` or `react-syntax-highlighter`. |
| **Chat Branching** | 💡 | The "Clone Chat" feature provides a manual way to branch conversations. A more integrated approach could be built upon this foundation. |

## 💻 Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/) 14 (App Router)
*   **AI SDK:** [Vercel AI SDK](https://sdk.vercel.ai/)
*   **Database & Auth:** [Supabase](https://supabase.io/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI:** [React](https://react.dev/), [Lucide Icons](https://lucide.dev/)
*   **Deployment:** [Vercel](https://vercel.com/)

## 🚀 Getting Started: Local Setup

Follow these steps to get a local copy up and running.

### 1. Prerequisites

*   [Node.js](https://nodejs.org/en) (v18.x or later)
*   [npm](https://www.npmjs.com/) or your preferred package manager
*   A [Supabase](https://supabase.com/) account (Free tier is sufficient)
*   API keys for any AI providers you wish to use (e.g., Google, OpenAI, Anthropic).

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
2.  Once the project is created, navigate to the **SQL Editor** and click **"New query"**.
3.  Copy the entire contents of the `/schema.sql` file from this repository and run it in the SQL Editor. This will create all the necessary tables, indexes, and security policies.
4.  Navigate to **Project Settings > API**. Here you will find your project URL and API keys needed for the next step.

### 5. Configure Environment Variables

This project uses the Vercel AI SDK to connect to multiple AI providers. **You only need to provide API keys for the services you intend to use.**

Create a file named `.env.local` in the root of your project and add the following variables.

```env
# .env.local

# --- Supabase Project Credentials (Required) ---
# Found in your Supabase project's "API Settings"
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# --- AI Provider API Keys (Add what you need) ---
# The Vercel AI SDK will automatically use these standard environment variables.

# For Google Gemini models
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key

# For OpenAI GPT and O1 models
OPENAI_API_KEY=your_openai_api_key

# For Anthropic Claude models
ANTHROPIC_API_KEY=your_anthropic_api_key

# For Mistral models
MISTRAL_API_KEY=your_mistral_api_key

# For Grok models from xAI
XAI_API_KEY=your_xai_api_key

# For DeepSeek models
DEEPSEEK_API_KEY=your_deepseek_api_key

# For Llama models via Cerebras
CEREBRAS_API_KEY=your_cerebras_api_key
```

### 6. Run the Development Server

You are now ready to start the application!

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🗃️ Database Schema Overview

The database is designed to be robust and scalable, with all tables secured by Row Level Security. The full schema is available in `/schema.sql`.

*   `profiles`: Stores public user data, linked one-to-one with `auth.users`.
*   `user_settings`: Contains user-specific preferences like theme, language, and personality traits for the AI.
*   `chats`: Holds metadata for each conversation, including title, model used, and a `metadata` field for tags, pinning, and archiving.
*   `messages`: Contains the content of each message, its role (`user` or `assistant`), and type.
*   `attachments`: A dedicated table linking files to specific messages.
*   `chat_index`: Powers the "Full Chat Index" feature by storing AI-generated snippets, summaries, and scores for key messages.

## 🌐 Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Remember to set all your required environment variables in the Vercel project settings.

## ⚖️ Competition Rules Compliance

*   **Open Source:** This project is licensed under the MIT License.
*   **Team Size:** This project was developed by [Your Name/Team Names].
*   **Content Usage:** I acknowledge that Theo may use this submission for content.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
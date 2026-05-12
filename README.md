<div align="center">
  <img src="ollama-nextjs-ui.gif">
</div>

<h1 align="center">
  Fully-featured web interface for Ollama LLMs
</h1>

<div align="center">
  
![GitHub Repo stars](https://img.shields.io/github/stars/jakobhoeg/nextjs-ollama-llm-ui)
  
</div>

Get up and running with Large Language Models **quickly**, **locally** and even **offline**.
This project aims to be the easiest way for you to get started with LLMs. No tedious and annoying setup required!

> This is a hobby project. If you want a more complete experience, I suggest taking a look at [this](https://github.com/open-webui/open-webui) instead.

# Features ✨

- **Multi-user authentication:** Optional user accounts with secure login/registration system.
- **Persistent chat history:** Save and access your conversations across devices when logged in.
- **Guest mode:** Use without registration - local storage keeps your chats temporarily.
- **Beautiful & intuitive UI:** Inspired by ChatGPT, to enhance similarity in the user experience.
- **Fully responsive:** Use your phone to chat, with the same ease as on desktop.
- **Easy setup:** No tedious and annoying setup required. Just clone the repo and you're good to go!
- **Code syntax highlighting:** Messages that include code, will be highlighted for easy access.
- **Copy codeblocks easily:** Easily copy the highlighted code with one click.
- **Download/Pull & Delete models:** Easily download and delete models directly from the interface.
- **Switch between models:** Switch between models fast with a click.
- **Database integration:** SQLite database with Prisma ORM for user data and chat persistence.
- **Secure authentication:** JWT tokens, password hashing, and protected routes.
- **Light & Dark mode:** Switch between light & dark mode.

# Authentication & Chat Management 🔐

## How to Login and Access Your Chats

### For New Users:
1. **Start immediately** - You can begin chatting without any account (guest mode)
2. **Optional registration** - Visit `/auth` or click "Sign In" in the sidebar
3. **Create account** - Register with email, username, and password
4. **Automatic sync** - Your future chats will be saved to your account

### For Existing Users with Accounts:
1. **Login** - Go to `/auth` or click "Sign In" in the sidebar
2. **Enter credentials** - Use your email and password
3. **Automatic loading** - Your saved chats will load automatically
4. **Cross-device access** - Access your chats from any device

### Chat Management:
- **Guest mode:** Chats stored locally in browser (temporary)
- **Authenticated mode:** Chats saved to database (persistent)
- **Seamless transition:** Can register later to save existing chats
- **Secure access:** Each user sees only their own chat history

### Authentication Features:
- **Secure login** with JWT tokens
- **Password encryption** using bcryptjs
- **Session management** with 7-day token expiration
- **Account recovery** (email-based, future feature)
- **Privacy protection** - your data is isolated and secure

# Preview

https://github.com/jakobhoeg/nextjs-ollama-llm-ui/assets/114422072/08eaed4f-9deb-4e1b-b87a-ba17d81b9a02

# Requisites ⚙️

To use the web interface, these requisites must be met:

1. Download [Ollama](https://ollama.com/download) and have it running. Or run it in a Docker container. Check the [docs](https://github.com/ollama/ollama) for instructions.
2. Node.js (18+) and npm is required. [Download](https://nodejs.org/en/download)

# Quick start with Docker

## Installation with prebuilt Docker image

- **If Ollama is running on your pc**:

```
docker run -d -p 8080:3000 --add-host=host.docker.internal:host-gateway -e OLLAMA_URL=http://host.docker.internal:11434 --name nextjs-ollama-ui --restart always jakobhoeg/nextjs-ollama-ui:latest
```

- **If Ollama is on a different server than the Web UI**:

```
docker run -d -p 8080:3000 --add-host=host.docker.internal:host-gateway -e OLLAMA_URL=http://example.com:11434 --name nextjs-ollama-ui --restart always jakobhoeg/nextjs-ollama-ui:latest
```

> You can also change the default 8080 port if you wish.

# Installation locally 📖

[![Packaging status](https://repology.org/badge/vertical-allrepos/nextjs-ollama-llm-ui.svg?columns=3)](https://repology.org/project/nextjs-ollama-llm-ui/versions)

Use a pre-build package from one of the supported package managers to run a local environment of the web interface.
Alternatively you can install from source with the instructions below.

> [!NOTE]  
> If your frontend runs on something other than `http://localhost` or `http://127.0.0.1`, you'll need to set the OLLAMA_ORIGINS to your frontend url.
>
> This is also stated in the [documentation](https://github.com/ollama/ollama/blob/main/docs/faq.md#how-do-i-configure-ollama-server):
>
> `Ollama allows cross-origin requests from 127.0.0.1 and 0.0.0.0 by default. Additional origins can be configured with OLLAMA_ORIGINS`

## Install from source

**1. Clone the repository to a directory on your pc via command prompt:**

```
git clone https://github.com/jakobhoeg/nextjs-ollama-llm-ui
```

**2. Open the folder:**

```
cd nextjs-ollama-llm-ui
```

**3. Rename the `.example.env` to `.env`:**

```
mv .example.env .env
```

**4. Set up environment variables in the `.env` file:**

```
OLLAMA_URL="http://localhost:11434"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
DATABASE_URL="file:./dev.db"
```

> Change `OLLAMA_URL` if your Ollama instance is running elsewhere
> 
> Change `JWT_SECRET` to a secure random string for production

**5. Install dependencies:**

```
npm install
```

**6. Set up the database:**

```
npx prisma generate
npx prisma db push
```

**7. Start the development server:**

```
npm run dev
```

**8. Go to [localhost:3000](http://localhost:3000) and start chatting!**

## Authentication Setup

After starting the application:

1. **Guest Mode**: Start chatting immediately without an account
2. **Create Account**: Visit `/auth` or click "Sign In" in the sidebar
3. **Register**: Fill in email, username, and password
4. **Login**: Use your credentials to access saved chats
5. **Manage Account**: Click your avatar in the sidebar for settings

Your chats will be automatically saved when you're logged in and accessible from any device!

# Upcoming features

This is a to-do list consisting of upcoming features.

- ✅ Voice input support
- ✅ Code syntax highlighting
- ✅ Ability to send an image in the prompt to utilize vision language models.
- ✅ Ability to regenerate responses
- ⬜️ Import and export chats

# Tech stack

[NextJS](https://nextjs.org/) - React Framework for the Web

[TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework

[shadcn-ui](https://ui.shadcn.com/) - UI component built using Radix UI and Tailwind CSS

[shadcn-chat](https://github.com/jakobhoeg/shadcn-chat) - Chat components for NextJS/React projects

[Framer Motion](https://www.framer.com/motion/) - Motion/animation library for React

[Lucide Icons](https://lucide.dev/) - Icon library

# Helpful links

[Medium Article](https://medium.com/@bartek.lewicz/launch-your-own-chatgpt-clone-for-free-on-colab-shareable-and-online-in-less-than-10-minutes-da19e44be5eb) - How to launch your own ChatGPT clone for free on Google Colab. By Bartek Lewicz.

[Lobehub mention](https://lobehub.com/blog/5-ollama-web-ui-recommendation#5-next-js-ollama-llm-ui) - Five Excellent Free Ollama WebUI Client Recommendations

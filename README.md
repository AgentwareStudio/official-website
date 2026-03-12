# Agentware Studio

Official website source for **Agentware Studio**: defining Agentware as the next software paradigm, from software for humans to software for agents.

Website: https://agentware.studio *(pending deployment / DNS resolution)*  
GitHub Org: https://github.com/AgentwareStudio

## About

Agentware is presented as a software class built for autonomous, goal-directed, and governable agents.  
Core framing on this site:

- Goal-driven by default
- Memory-native architecture
- Tool-mediated execution
- Governable autonomy
- Closed-loop improvement

The site also contrasts traditional software vs Agentware and outlines future directions such as personal intelligence systems, agent-native browsers, AI tutors, and multi-agent workflows.

## Tech Stack

- React 18 + TypeScript
- Vite 6
- Tailwind CSS 4
- Motion (animation)
- Lucide React (icons)

## Local Development

```bash
npm install
npm run dev
```

The app runs on `http://localhost:3000`.

## Build

```bash
npm run build
npm run preview
```

## Deploy on Vercel

This project is Vite-based and can be deployed directly on Vercel.

1. Import the repository in Vercel.
2. Framework preset: `Vite`.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Deploy.

For CLI deployment:

```bash
npm i -g vercel
vercel
vercel --prod
```

## License

Project license headers in source files currently indicate `Apache-2.0`.

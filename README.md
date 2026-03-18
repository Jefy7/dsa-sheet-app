# DSA Sheet App Frontend

Production-ready frontend built with Next.js App Router, TypeScript, Redux Toolkit, and Axios.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment:

```bash
cp .env.example .env.local
```

3. Add API base URL:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-server.com
```

4. Run development server:

```bash
npm run dev
```

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`

## API Endpoints used (frontend only)

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/topics`
- `GET /api/progress`
- `POST /api/progress/update`

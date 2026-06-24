# ── Stage 1: Install dependencies ─────────────────────────────────────────────
FROM node:20-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ── Stage 2: Build the Vite/React app ─────────────────────────────────────────
FROM node:20-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ── Stage 3: Serve with nginx ──────────────────────────────────────────────────
FROM nginx:stable-alpine AS runner
# Remove the default nginx static content
RUN rm -rf /usr/share/nginx/html/*
# Copy the built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html
# Copy custom nginx config to handle client-side routing (React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

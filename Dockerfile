# Declare base image
FROM node:18.16.1-alpine AS base

# ---- STAGE: Install Dependencies ---- #
FROM base AS deps

# Add recommended package from node-alpine
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install pnpm, copy package.json and install dependencies
RUN yarn global add pnpm
COPY package.json pnpm-lock.yaml ./

# Install python, make, and g++ for building native dependencies
# after installing, remove them to reduce image size
RUN apk add py3-pip make g++ 

RUN pnpm install --frozen-lockfile


# ---- STAGE: Build and Compile ---- #
FROM base AS builder

WORKDIR /app

# Copy dependencies from dependency stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code from local machine
# Make sure to ignore node_modules, .next, .git, etc
COPY . .

# Disable NextJs telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Install python
# RUN apk update && apk add python3

RUN yarn build


# ---- STAGE: Production ---- #
FROM base AS runner

WORKDIR /app

# Set node environment to production and disable telemetry
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# RUN apk update && apk add python3

# Install pm2 runtime
RUN yarn global add pm2

# Add user and group to run app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public folder
COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["pm2-runtime", "node", "--", "server.js"]
FROM node:14.15-slim as base
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/database/ ./database
COPY .sequelizerc .
COPY .env .
COPY --from=builder /app/uploads ./uploads
EXPOSE 5000
CMD ["npm","start"]
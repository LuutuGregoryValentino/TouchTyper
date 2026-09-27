FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 5173

#host set to 0.0.0.0 to expose Vite server outside the container boundary
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
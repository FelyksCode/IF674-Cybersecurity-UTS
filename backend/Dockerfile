FROM node:18

WORKDIR /app/backend

COPY backend/package*.json ./

RUN npm install

COPY backend/ .

EXPOSE 80 3000

# Menyalin sertifikat SSL ke dalam container
COPY ./certs/fullchain.pem /etc/ssl/certs/fullchain.pem
COPY ./certs/privkey.pem /etc/ssl/private/privkey.pem

CMD ["node", "server.js"]

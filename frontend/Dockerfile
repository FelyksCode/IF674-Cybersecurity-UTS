FROM node:18-alpine

WORKDIR /app/frontend

COPY frontend/package*.json ./

RUN npm install

COPY frontend/ .

# Copy SSL certificates into the container
COPY ./certs/fullchain.pem /etc/ssl/certs/
COPY ./certs/privkey.pem /etc/ssl/private/

#EXPOSE 5173
EXPOSE 443

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

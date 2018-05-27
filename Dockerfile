#FROM node:boron
FROM node:8.9.1
#FROM hyperledger/composer-cli
# Create app directory
WORKDIR /usr/src/app2

# Install app dependencies
COPY package.json .
# For npm@5 or later, copy package-lock.json as well
# COPY package.json package-lock.json .

RUN npm install


# Bundle app source
COPY . .

CMD [ "node", "TomsMessageAdapter.js"]
#ENTRYPOINT [ "/usr/src/app/TomsServer.js"]

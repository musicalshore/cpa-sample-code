FROM node:12.16.1-alpine
COPY ["package.json", "package-lock.json", "./"]
RUN npm set progress=false && npm config set depth 0 && npm cache clean --force
## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm i && mkdir /client &&  cp -R ./node_modules ./client
WORKDIR /client
COPY . /client 
RUN npm run build
EXPOSE 3005
CMD [ "npm", "start" ]
FROM node:7.5.0
ADD package.json .
RUN npm install --silent
ADD components components
ADD lib lib
ENV NODE_ENV production
CMD ["node", "--harmony", "lib/index.js"]

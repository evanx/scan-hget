FROM node:7.4.0
ADD package.json .
RUN npm install
ADD components components
ADD app app
ENV NODE_ENV development
CMD ["node", "--harmony", "app/index.js"]

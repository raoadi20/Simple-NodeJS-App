# Use Node.js base image
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy application source code
COPY . .

# Expose port 3000
EXPOSE 3000

# Run the app
CMD ["npm", "start"]

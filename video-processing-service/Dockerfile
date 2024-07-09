# Stage 1: Build stage
FROM node:18 AS builder

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json into the working directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Bundle app source inside the docker image
COPY . .

# Build the app
RUN npm run build

# Stage 2: Production stage
FROM node:18

# Install ffmpeg in the container
RUN apt-get update && apt-get install -y ffmpeg

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy built app from the builder stage
COPY --from=builder /app/dist ./dist

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Define the command to run your app using CMD which defines your runtime
CMD [ "npm", "run", "serve" ]











# # Starting with the official Node runtime as parent image
# FROM node:20

# #Set the working directory in the container to /app
# WORKDIR /app

# # Copy json files into working directory
# COPY package*.json ./

# RUN apt-get update && apt-get install -y ffmpeg

# # Intall any needed packages specified in package.json
# RUN npm install

# # Copy app source inside the image
# COPY . .

# # Make port 3000 available outside the container    
# EXPOSE 3000

# # Define the command to run your app using CMD (ONLY 1 CMD allowed in Dockerfile)
# CMD ["npm", "start"]
# Stage 1: Build the React application
# Use a Node.js image to build the frontend assets
FROM node:20-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to leverage Docker cache
# These files are now assumed to be in the build context (cloned repo)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
# This copies everything from the build context (cloned repo) into /app
COPY . .

# Build the React application for production
# Assuming your build output goes to a 'build' folder. If it's 'dist', change this line.
RUN npm run build

# Stage 2: Serve the application using Nginx (a lightweight web server)
FROM nginx:alpine

# Copy the built React app from the build stage to Nginx's public directory
# Adjust '/app/build' if your build output directory is different (e.g., '/app/dist')
COPY --from=build /app/build /usr/share/nginx/html

# Copy a custom Nginx configuration file
# This file must also be in the root of your GitHub repo
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (default HTTP port for Nginx)
EXPOSE 80

# Command to run Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]

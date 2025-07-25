# Stage 1: Build the React application
# Use a Node.js image to build the frontend assets
FROM node:20-alpine AS build

# Install git to clone the repository
RUN apk add --no-cache git

# Set a build argument for the GitHub repository URL
ARG GITHUB_REPO_URL
ARG GITHUB_BRANCH=main # Default to 'main' branch, can be overridden

# Set the working directory inside the container
WORKDIR /app

# Clone the repository
# Ensure your repository is public or you handle authentication (e.g., SSH keys, tokens)
RUN git clone ${GITHUB_REPO_URL} .

# Checkout a specific branch (optional, but good for consistent builds)
RUN git checkout ${GITHUB_BRANCH}

# Install dependencies
# Assuming package.json is in the root of the cloned repo
COPY package*.json ./
RUN npm install

# Build the React application for production
# Assuming your build output goes to a 'build' folder. If it's 'dist', change this line.
RUN npm run build

# Stage 2: Serve the application using Nginx (a lightweight web server)
FROM nginx:alpine

# Copy the built React app from the build stage to Nginx's public directory
# Adjust '/app/build' if your build output directory is different (e.g., '/app/dist')
COPY --from=build /app/build /usr/share/nginx/html

# Copy a custom Nginx configuration file
# This is crucial for single-page applications to handle routing correctly
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (default HTTP port for Nginx)
EXPOSE 80

# Command to run Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]

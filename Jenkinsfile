pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                // Checkout the code from GitHub
                git branch: 'main', url: 'https://github.com/raoadi20/Simple-NodeJS-App.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                // Install dependencies using npm
                sh 'npm install'
            }
        }
        
        stage('Unit Test') {
            steps {
                // Run unit tests using npm
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Build the Docker image
                    sh 'docker build -t nodejs-todo-app .'
                }
            }
        }

        stage('Scan Docker Image using Trivy') {
            steps {
                script {
                    // Install Trivy if not already installed

                    // Scan the Docker image for vulnerabilities
                    sh 'sudo trivy image nodejs-todo-app'
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                script {
                    // Login to Docker Hub with username and password
                    sh 'echo "Rao.Adnan1994$" | docker login -u raoadi20 --password-stdin'
                }
            }
        }
        
        stage('Staging Deployment on Development Server') {
            steps {
                script {
                    // Stop any existing container
                    sh 'docker ps -a --format "{{.Names}}" | grep nodejs-staging || true && docker stop nodejs-staging || true && docker rm nodejs-staging || true'
                    // Run the Docker container in detached mode on the development server
                    sh 'docker run -d --name nodejs-staging -p 8000:8000 nodejs-todo-app'
                    
                    // Push the Docker image to Docker Hub
                    sh 'docker tag nodejs-todo-app raoadi20/nodejs-todo-app' // Tagging the image
                    sh 'docker push raoadi20/nodejs-todo-app'           // Pushing the image to Docker Hub
                }
            }
        }

        stage('Manual Approval') {
            steps {
                script {
                    // Wait for admin approval before deploying to production
                    input message: 'Approve deployment to production?', 
                          ok: 'Deploy', 
                          submitter: 'admin' // The user who needs to approve, you can also leave it for any user
                }
            }
        }
        
        stage('Deploy to Production Server') {
            steps {
                // Deploy to production server using SSH
                sshagent(['prod-ssh-key']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no prosecops@172.16.5.131 '
                    docker ps -a --format "{{.Names}}" | grep nodejs-prod || true && sudo docker stop nodejs-prod || true && sudo docker rm nodejs-prod || true
                    docker pull raoadi20/nodejs-todo-app
                    docker run -d --name nodejs-prod -p 8000:8000 raoadi20/nodejs-todo-app
                    '
                    """
                }
            }
        }
    }
}

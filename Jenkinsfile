pipeline {
    agent any

    environment {
        SONAR_SCANNER_HOME = tool 'sonarscanner' // Replace 'SonarScanner' with the name you configured
    }

    stages {
        stage('Checkout Code') {
            steps {
                // Checkout the code from GitHub
                git branch: 'dev', url: 'https://github.com/raoadi20/Simple-NodeJS-App.git'
            }
        }    

    stage('Debug Environment') {
        steps {
            sh 'echo $PATH'
            sh 'which node || echo "Node.js not found"'
            sh 'which npm || echo "npm not found"'
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
                script {
                    sh 'npm test'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonarserver') { // Replace 'My SonarQube' with your configured SonarQube server name
                    sh "${env.SONAR_SCANNER_HOME}/bin/sonar-scanner"
                    sh 'sonar-scanner -Dsonar.javascript.lcov.reportPaths=coverage/lcov-report/lcov.info'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                // Check if the Docker image exists, remove it if it does, and then build a new one
                    sh '''
                    if docker images | grep -q nodejs-todo-app; then
                        echo "Image nodejs-todo-app found. Removing it..."
                        docker ps -a --format "{{.Names}}" | grep nodejs-staging || true && docker stop nodejs-staging || true && docker rm nodejs-staging || true
                        docker rmi -f nodejs-todo-app
                    else
                        echo "Image nodejs-todo-app not found. Proceeding to build..."
                    fi
                    docker build -t nodejs-todo-app .
                    '''
                }
            }
        }

        stage('Scan Docker Image using Trivy') {
            steps {
                script {
                    // Install Trivy if not already installed

                    // Scan the Docker image for vulnerabilities
                    sh 'trivy image nodejs-todo-app'
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
    }
}

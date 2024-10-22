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

        stage('SonarQube Analysis') {
    steps {
        script {
            // Define the SonarQube Scanner
            def scannerHome = tool 'SonarQube Scanner' // Name should match the one you configured in Jenkins

            // Run SonarQube analysis
            withSonarQubeEnv('SonarQube') { // Replace 'SonarQube' with the name of your SonarQube server configuration
                sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=Nodejs-App-Analysis -Dsonar.sources=./src -Dsonar.host.url=http://172.16.5.118:9000/ -Dsonar.login=sqp_3309523d16b8aedb3593940401e8af0f0ea89a71"
            }
        }
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

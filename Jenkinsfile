pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = "elms"  // Optional: avoids container name collisions
    }

    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Clone Repository') {
            steps {
                checkout scm
            }
        }

        stage('Build & Deploy') {
            steps {
                script {
                    // Ensure Docker is available and compose works
                    bat 'docker-compose down'
                    bat 'docker-compose up -d --build'
                }
            }
        }
    }

    post {
        failure {
            echo '❌ Pipeline failed. Check Jenkins logs.'
            cleanWs()
        }
        success {
            echo '✅ Deployment successful.'
        }
    }
}

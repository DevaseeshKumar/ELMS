pipeline {
    agent any

    environment {
        DOCKER_BUILDKIT = 1
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/DevaseeshKumar/ELMS.git'
            }
        }

        stage('Inject .env File') {
            steps {
                withCredentials([string(credentialsId: 'mern-env', variable: 'BACKEND_ENV')]) {
                    writeFile file: '.env', text: "${BACKEND_ENV}"
                }
            }
        }

        stage('Verify Docker Installation') {
            steps {
                bat 'docker --version'
                bat 'docker-compose --version'
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    bat 'npm install'
                }
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                }
            }
        }

        stage('Start MERN Stack with Docker Compose') {
            steps {
                bat 'docker-compose down'
                bat 'docker-compose up -d --build'
                bat 'docker-compose logs --tail=50'
            }
        }
    }

    post {
        success {
            echo '✅ MERN Stack Deployed Successfully!'
        }
        failure {
            echo '❌ Pipeline failed. Check Jenkins logs.'
        }
        cleanup {
            cleanWs()
        }
    }
}

pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/DevaseeshKumar/ELMS.git'
            }
        }

        stage('Verify Docker Installation') {
            steps {
                bat 'docker --version'
                bat 'docker-compose --version'
            }
        }

        stage('Inject .env for Backend') {
            steps {
                withCredentials([string(credentialsId: 'mern-env', variable: 'ENV_CONTENT')]) {
                    writeFile file: 'backend/.env', text: ENV_CONTENT
                }
            }
        }

        stage('Build Backend Image') {
            steps {
                dir('backend') {
                    bat 'npm install'
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                }
            }
        }

        stage('Start MERN App with Docker Compose') {
            steps {
                bat 'docker-compose down'
                bat 'docker-compose up -d --build'
                bat 'docker-compose logs'
            }
        }
    }

    post {
        success {
            echo '✅ MERN Stack Deployed Successfully!'
        }
        failure {
            echo '❌ Pipeline failed. Please check the Jenkins logs.'
        }
        cleanup {
            cleanWs()
        }
    }
}

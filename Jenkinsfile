pipeline {
    agent any

    environment {
        // Your environment variables
        DOCKER_IMAGE_NAME = 'elms-app'
    }

    stages {
        stage('Clone Repository') {
            steps {
                git credentialsId: 'your-github-credentials-id', url: 'https://github.com/DevaseeshKumar/ELMS.git', branch: 'main'
            }
        }

        stage('Write .env') {
            steps {
                writeFile file: '.env', text: """
PORT=8000
DB_URL=mongodb+srv://ELMS:ELMS@cluster0.uqtzdbr.mongodb.net/elms?retryWrites=true&w=majority&appName=Cluster0
EMAIL_USER=thorodinsonuru@gmail.com
EMAIL_PASS=qzerfjxnvoeupsgp
"""
            }
        }

        stage('Build & Deploy') {
            steps {
                sh 'docker compose -f docker-compose.yml down'
                sh 'docker compose -f docker-compose.yml up --build -d'
            }
        }
    }

    post {
        failure {
            echo '❌ Pipeline failed. Check Jenkins logs.'
            cleanWs()
        }
    }
}

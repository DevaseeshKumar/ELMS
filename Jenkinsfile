pipeline {
    agent any

    environment {
        // Your environment variables
        DOCKER_IMAGE_NAME = 'elms-app'
    }

    stages {
        stage('Clone Repository') {
            steps {
                git credentialsId: 'your-github-credentials-id', url: 'https://github.com/thorodinsonuru/ELMS.git', branch: 'main'
            }
        }

        stage('Write .env') {
            steps {
                writeFile file: '.env', text: """
PORT=8000
DB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/elms?retryWrites=true&w=majority
EMAIL_USER=youremail@example.com
EMAIL_PASS=yourpassword
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

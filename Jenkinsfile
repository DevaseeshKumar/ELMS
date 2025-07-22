pipeline {
    agent any

    environment {
        // MongoDB
        MONGODB_URL = 'mongodb+srv://ELMS:ELMS@cluster0.uqtzdbr.mongodb.net/elms?retryWrites=true&w=majority&appName=Cluster0'
        
        // Email
        EMAIL_USER = 'thorodinsonuru@gmail.com'
        EMAIL_PASS = 'qzerfjxnvoeupsgp'

        // Server config
        PORT = '8000'
        FRONTEND_URL = 'https://employeeleavemanagementsys.netlify.app'
        SESSION_SECRET = 'elms-secret-key'
        NODE_ENV = 'production'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/your-repo/elms.git'
            }
        }

        stage('Write .env') {
            steps {
                script {
                    writeFile file: '.env', text: """
                    mongodburl=${env.MONGODB_URL}
                    EMAIL_USER=${env.EMAIL_USER}
                    EMAIL_PASS=${env.EMAIL_PASS}
                    PORT=${env.PORT}
                    FRONTEND_URL=${env.FRONTEND_URL}
                    SESSION_SECRET=${env.SESSION_SECRET}
                    NODE_ENV=${env.NODE_ENV}
                    """
                }
            }
        }

        stage('Build & Deploy') {
            steps {
                bat "docker-compose down"
                bat "docker-compose up -d --build"
            }
        }
    }

    post {
        failure {
            echo '❌ Pipeline failed. Check Jenkins logs.'
            cleanWs()
        }
        success {
            echo '✅ Deployed successfully!'
        }
    }
}

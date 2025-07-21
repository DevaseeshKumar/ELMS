pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        git branch: 'main', url: 'https://github.com/DevaseeshKumar/ELMS.git'
      }
    }

    stage('Build Dev Containers') {
      steps {
        bat 'docker-compose build'
      }
    }

    stage('Run Dev Containers') {
      steps {
        bat 'docker-compose up -d'
      }
    }

    stage('Verify') {
      steps {
        bat 'docker ps'
      }
    }
  }

  post {
    success {
      echo '✅ Pipeline executed successfully!'
    }
    failure {
      echo '❌ Pipeline failed. Please check logs.'
    }
  }
}

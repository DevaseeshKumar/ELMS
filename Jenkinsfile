pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        git url: 'https://github.com/DevaseeshKumar/ELMS.git', branch: 'main'
      }
    }

    stage('Build Dev Containers') {
      steps {
        sh 'docker-compose build'
      }
    }

    stage('Run Dev Containers') {
      steps {
        sh 'docker-compose up -d'
      }
    }

    stage('Verify') {
      steps {
        sh 'docker ps'
      }
    }
  }

  post {
    success {
      echo '✅ Development environment is running!'
    }
    failure {
      echo '❌ Something went wrong.'
    }
  }
}

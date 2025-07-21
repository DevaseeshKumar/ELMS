pipeline {
  agent any

  stages {
    stage('Build Docker Images') {
      steps {
        bat 'docker-compose build'
      }
    }

    stage('Run Docker Containers') {
      steps {
        bat 'docker-compose up -d'
      }
    }
  }
}

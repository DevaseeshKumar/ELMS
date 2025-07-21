pipeline {
  agent any

  stages {
    stage('Build Docker Images') {
      steps {
        sh 'docker-compose build'
      }
    }

    stage('Run Docker Containers') {
      steps {
        sh 'docker-compose up -d'
      }
    }
  }
}

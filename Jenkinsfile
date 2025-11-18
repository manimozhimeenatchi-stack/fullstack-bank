pipeline {
    agent any

    tools {
        jdk 'jdk17'
        nodejs 'nodejs16'
    }

    environment {
        SCANNER_HOME = tool 'sonar-scanner'
    }

    stages {
        stage('Check Disk Space (start)') {
            steps {
                sh 'df -h'
            }
        }

        stage('GIT CHECKOUT') {
            steps {
                git branch: 'main', url: 'https://github.com/manimozhimeenatchi-stack/fullstack-bank.git'
            }
        }

        stage('TRIVY FS SCAN') {
            steps {
                sh 'trivy fs .'
            }
        }

        stage('SONARQUBE ANALYSIS') {
            steps {
                // ensure sonar-server URL is correct in Manage Jenkins -> Configure System
                withSonarQubeEnv('sonar-server') {
                    sh "$SCANNER_HOME/bin/sonar-scanner -Dsonar.projectName=Bank -Dsonar.projectKey=Bank"
                }
            }
        }

        stage('DEBUG: Network & npm log') {
            steps {
                // run simple network checks from the same agent that executes the job
                sh '''
                  echo "=== curl download.cypress.io ==="
                  curl -v "https://download.cypress.io/desktop/11.1.0?platform=linux&arch=x64" -o /dev/null || true
                  echo "=== ping download.cypress.io ==="
                  ping -c 3 download.cypress.io || true
                  echo "=== npm debug logs (if present) ==="
                  ls -l /var/lib/jenkins/.npm/_logs || true
                  tail -n 200 /var/lib/jenkins/.npm/_logs/*.log || true
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                // TEMPORARY WORKAROUND: skip Cypress binary download so npm completes.
                // Replace with real fix: set proxy, mirror, or use docker image with Cypress included.
                withEnv(["CYPRESS_INSTALL_BINARY=0"]) {
                    sh 'npm ci'
                }
            }
        }

        stage('frontend') {
            steps {
                dir('app/frontend') {
                    withEnv(["CYPRESS_INSTALL_BINARY=0"]) {
                        sh 'npm ci'
                    }
                }
            }
        }

        stage('backend') {
            steps {
                dir('app/backend') {
                    withEnv(["CYPRESS_INSTALL_BINARY=0"]) {
                        sh 'npm ci'
                    }
                }
            }
        }
        stage('Verify Docker Compose') {
				steps {
						sh 'docker-compose --version'
				}
			}
		stage('Deploy to container') {
				steps {
						sh "npm run compose:up -d"
				}
		}
    }
}

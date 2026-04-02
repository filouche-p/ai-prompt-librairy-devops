# Start app with docker
- sudo docker build -t ai-prompt-librairy-devops .
- sudo docker run -d -p 8080:80 ai-prompt-librairy-devops (--name site)
- sudo docker ps

# Stop docker
- docker stop <DOCKER_ID>
- docker rm <DOCKER_ID>
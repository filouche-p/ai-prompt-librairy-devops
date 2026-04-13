# Start app with docker
- sudo docker build -t ai-prompt-librairy-devops .
- sudo docker run -d -p 8080:80 (--name site) ai-prompt-librairy-devops
- sudo docker ps

# Stop docker
- docker stop <DOCKER_ID>
- docker rm <DOCKER_ID>

# CLI
- Arrêter : docker stop site
- Redémarrer : docker restart site
- Voir les logs : docker logs -f site
- Supprimer : docker rm -f site


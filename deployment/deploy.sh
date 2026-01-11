cd ../Art
mvn package

cd ../deployment
docker compose -f docker-compose.dev.yaml up  --build
cd ../Art
mvn package

cd ../deployment
docker compose -f docker-compose.beta.yaml up  --build -d
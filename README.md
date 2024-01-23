# build image

docker build -t crisissettled/jsonviewer:v1.3 .

# publish to docker hub

docker push crisissettled/jsonviewer:v1.3

#deploy
sudo docker run -d --restart always --name jsonviewer -p 80:80 crisissettled/jsonviewer:v1.3

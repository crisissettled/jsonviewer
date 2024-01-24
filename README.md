# build image

docker build -t crisissettled/jsonviewer:v1.4 .

# publish to docker hub

docker push crisissettled/jsonviewer:v1.4

#deploy
sudo docker run -d --restart always --name jsonviewer -p 80:80 crisissettled/jsonviewer:v1.4

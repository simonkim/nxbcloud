PWD=$(shell echo `pwd`)
start:
	docker build -t simonkim/nxbcloud .
	docker network inspect nxbcloud-net || docker network create -d bridge nxbcloud-net
	docker run --net=nxbcloud-net --name shared-mongo -v $(PWD)/data:/data/db -d mongo:latest
	docker run --net=nxbcloud-net --name nxbcloud -v $(PWD):/app -d -p 3500:80 simonkim/nxbcloud:latest

stop:
	docker stop nxbcloud && docker rm nxbcloud
	docker stop shared-mongo && docker rm shared-mongo


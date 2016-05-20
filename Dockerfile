FROM node
#FROM debian:wheezy

#RUN apt-get update && \
#   apt-get install -y git curl && \
#   (curl https://deb.nodesource.com/setup | sh) && \
#   apt-get install -y nodejs jq && \
#   apt-get clean && \
#   rm -Rf /var/lib/apt/lists/* /tmp/* /var/tmp/*


RUN curl -sL https://install.meteor.com | sed s/--progress-bar/-sL/g | /bin/sh
EXPOSE 80

WORKDIR /app
ENV METEOR_VERSION=1.2.1
ENV MONGO_URL=mongodb://shared-mongo:27017/nxbcloud 
CMD meteor --release ${METEOR_VERSION}  run --production --port 80

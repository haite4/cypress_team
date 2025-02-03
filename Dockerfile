FROM node:18

RUN apt-get update && \
    apt-get install -y openjdk-17-jre-headless curl tar && \
    ALLURE_VERSION=$(curl -s https://api.github.com/repos/allure-framework/allure2/releases/latest | grep '"tag_name":' | cut -d '"' -f 4 | sed 's/v//') && \
    curl -o allure.tgz -Ls "https://repo.maven.apache.org/maven2/io/qameta/allure/allure-commandline/${ALLURE_VERSION}/allure-commandline-${ALLURE_VERSION}.tgz" && \
    tar -zxvf allure.tgz -C /opt/ && \
    ln -s "/opt/allure-${ALLURE_VERSION}/bin/allure" /usr/bin/allure && \
    rm allure.tgz


WORKDIR /usr/workspace



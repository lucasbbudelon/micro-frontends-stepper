PROJECT_NAME=${PWD##*/}
URL_SURGE="${PROJECT_NAME}.micro-frontends-stepper.surge.sh"
BUILD_PATH="./build"

npm run build
surge -p ${BUILD_PATH} -d ${URL_SURGE}

echo "publish ${PROJECT_NAME} completed: http://${URL_SURGE}"

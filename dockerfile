FROM node:18-alpine

# Establece el directorio de trabajo en el contenedor
WORKDIR /app/foundationsBackend

# Dependencias
COPY package*.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

# Compila la aplicación (ajusta esto según tu configuración de compilación)
RUN yarn build

EXPOSE 3000

# Define el comando para ejecutar la aplicación cuando se inicie el contenedor
CMD [ "yarn", "start:prod" ]

# Etapa de construcción:
FROM node:18.17.1 AS build

# Establecer el directorio de trabajo dentro del contenedor:
WORKDIR /app

# Copiamos el package.json y el package-lock.json al directorio de trabajo:
COPY package*.json ./

# Instalamos todas las dependencias del proyecto, incluyendo las de desarrollo:
RUN npm install

# Copiamos todo el código fuente al directorio de trabajo:
COPY . .

# Construimos la aplicación:
RUN npm run build --prod

# Etapa de producción:
FROM nginx:alpine

# Copiamos los archivos compilados desde la etapa de construcción:
COPY --from=build /app/dist/* /usr/share/nginx/html/

# Exponemos el puert 80
EXPOSE 80

# Corremos la aplicación con el CMD
CMD ["nginx", "-g", "daemon off;"]

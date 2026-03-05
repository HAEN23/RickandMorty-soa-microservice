# Usa una imagen base de Node.js
FROM node:20-alpine

# Instala wget para el healthcheck
RUN apk add --no-cache wget

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala todas las dependencias (incluyendo dev para tsx)
RUN npm install

# Copia el código fuente
COPY . .

# Expone el puerto del microservicio
EXPOSE 4002

# Comando para ejecutar la aplicación
CMD ["npm", "run", "dev"]

# Usa una imagen base de Node.js
FROM node:20-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala todas las dependencias (incluyendo tsx)
RUN npm install

# Copia el código fuente
COPY . .

# Expone el puerto del gateway
EXPOSE 5001

# Comando para ejecutar la aplicación
CMD ["npm", "run", "dev"]

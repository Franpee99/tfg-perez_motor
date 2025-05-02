FROM php:8.2-apache

# Instala extensiones necesarias para Laravel
RUN apt-get update && apt-get install -y \
    git unzip curl libpng-dev libonig-dev libxml2-dev zip \
    libzip-dev npm \
    && docker-php-ext-install pdo pdo_mysql zip

# Copia el proyecto al contenedor
COPY . /var/www/html

WORKDIR /var/www/html

# Instala Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Instala dependencias PHP y JavaScript
RUN composer install --no-dev --optimize-autoloader
RUN npm install && npm run build

# Crea clave de app
RUN php artisan key:generate

# Puerto expuesto (80)
EXPOSE 80

# Comando para arrancar Laravel
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=80"]

FROM php:8.2-apache

# Instala extensiones necesarias para Laravel
RUN apt-get update && apt-get install -y \
    git unzip curl libpng-dev libonig-dev libxml2-dev zip \
    libzip-dev npm \
    && docker-php-ext-install pdo pdo_mysql zip

# Copia el proyecto al contenedor
COPY . /var/www/html

WORKDIR /var/www/html

# Instala Composer (modo seguro para evitar errores como root)
RUN curl -sS https://getcomposer.org/installer | php \
    && mv composer.phar /usr/local/bin/composer \
    && composer config --global allow-plugins.dealerdirect/phpcodesniffer-composer-installer true \
    && composer global config --no-plugins allow-plugins.composer/installers true \
    && composer global config --no-plugins allow-plugins.composer/package-versions-deprecated true

# Instala dependencias PHP y JavaScript
RUN composer install --optimize-autoloader
RUN npm install && npm run build

# Crea clave de app (evita error si ya existe)
RUN if [ ! -f .env ]; then cp .env.example .env; fi && php artisan key:generate

# Puerto expuesto (Render usará el 80 por defecto)
EXPOSE 80

# Comando para arrancar Laravel
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=80"]

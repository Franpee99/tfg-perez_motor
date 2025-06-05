Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/jammy64"

  config.vm.hostname = "perezmotor.local"
  config.vm.network "private_network", ip: "192.168.56.10"
  config.vm.network "public_network"

  # Sincronización de carpeta
config.vm.synced_folder ".", "/var/www/perez_motor",
  type: "nfs",
  nfs_version: 4,
  mount_options: ['tcp', 'actimeo=2', 'nolock']


  config.vm.provider "virtualbox" do |vb|
    vb.memory = "2048"
  end

  config.vm.provision "shell", privileged: false, inline: <<-SHELL
    sudo apt-get update
    sudo apt-get install -y software-properties-common lsb-release ca-certificates apt-transport-https curl

    # PHP 8.2 y Apache
    sudo add-apt-repository ppa:ondrej/php -y
    sudo apt-get update
    sudo apt-get install -y php8.2 php8.2-cli php8.2-common php8.2-mbstring php8.2-xml php8.2-pgsql php8.2-curl php8.2-bcmath php8.2-zip unzip apache2 libapache2-mod-php8.2

    # Habilitar mod_rewrite y VirtualHost
    sudo a2enmod rewrite
    sudo a2dissite 000-default
    sudo systemctl restart apache2

    # Node.js (para Vite/React)
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo bash -
    sudo apt-get install -y nodejs

    # Composer
    if [ ! -f /usr/local/bin/composer ]; then
      curl -sS https://getcomposer.org/installer | php
      sudo mv composer.phar /usr/local/bin/composer
    fi

    # PostgreSQL
    sudo apt-get install -y postgresql postgresql-contrib

    # BBDD Y USUARIO
    sudo -u postgres psql -c "CREATE USER perez_motor WITH PASSWORD 'perez_motor';" || true
    sudo -u postgres psql -c "CREATE DATABASE perez_motor OWNER perez_motor;" || true

    # VirtualHost
    echo '<VirtualHost *:80>
        ServerName perez_motor.local
        DocumentRoot /var/www/perez_motor/public
        <Directory /var/www/perez_motor/public>
            AllowOverride All
            Require all granted
        </Directory>
        ErrorLog ${APACHE_LOG_DIR}/perez_motor_error.log
        CustomLog ${APACHE_LOG_DIR}/perez_motor_access.log combined
    </VirtualHost>' | sudo tee /etc/apache2/sites-available/perez_motor.conf

    sudo a2ensite perez_motor
    sudo systemctl reload apache2

    # Permisos
    sudo chown -R vagrant:vagrant /var/www/perez_motor
    sudo chmod -R 777 /var/www/perez_motor
  SHELL
end

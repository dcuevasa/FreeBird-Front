# Free Bird

Free Bird es una aplicación web diseñada para ayudar a los usuarios a planificar y gestionar sus actividades y viajes de manera eficiente. La aplicación permite a los usuarios crear itinerarios, agregar actividades, y gestionar perfiles de usuario.

Este es el front de la aplicaciíon que esta diseñada para funcionar en el puerto 3001 con el Back: https://github.com/dcuevasa/FreeBird-Back, corriendo en el puerto 3000 de la misma maquina


## Instalación

1. Clona el repositorio:
    ```sh
    git clone https://github.com/tu-usuario/free-bird.git
    cd free-bird
    ```

2. Instala las dependencias:
    ```sh
    npm install
    ```

## Scripts Disponibles

En el directorio del proyecto, puedes ejecutar:

### `npm start`

Inicia la aplicación en modo de desarrollo.\
Abre [http://localhost:3000](http://localhost:3000) para verlo en tu navegador.

### `npm test`

Lanza el corredor de pruebas en el modo interactivo de observación.\
Utiliza [Jest](https://jestjs.io/) para las pruebas unitarias y [Cypress](https://www.cypress.io/) para las pruebas de extremo a extremo.

### `npm run build`

Construye la aplicación para producción en la carpeta `build`.\
Empaqueta correctamente React en modo de producción y optimiza la construcción para el mejor rendimiento.

## Configuración de Pruebas

### Jest

La configuración de Jest se encuentra en el archivo [jest.config.js](jest.config.js). Las pruebas unitarias están ubicadas en el directorio `src/components/__tests__/`.

### Cypress

La configuración de Cypress se encuentra en el archivo [cypress.config.js](cypress.config.js). Las pruebas de extremo a extremo están ubicadas en el directorio `cypress/e2e/`.

## Internacionalización

La aplicación utiliza `react-i18next` para la internacionalización. La configuración principal se encuentra en el archivo [src/i18n.js](src/i18n.js).

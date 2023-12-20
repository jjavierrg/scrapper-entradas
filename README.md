# Proyecto de scrapping de entradas

[![Licencia](https://img.shields.io/badge/Licencia-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Estado del proyecto](https://img.shields.io/badge/Estado-Activo-brightgreen.svg)](https://github.com/jjavierrg/scrapper-entradas)
[![Versión de NodeJS](https://img.shields.io/badge/NodeJS-12.x.x-brightgreen.svg)](https://nodejs.org/en/)

## Descripción

Este proyecto que monitorea la disponibilidad de entradas para un determinado evento y manda una notificación de Telegram cuando hay disponibilidad.

## Requisitos

- NodeJS versión 12 o superior

## Instalación y ejecución

1. Clonar el repositorio
2. Ejecutar `npm install`
3. Ejecutar `npm run start -- --url=<url> --telegramToken=<token> --telegramChatId=<chatId>`

También se puede ejecutar directamente con `node index.js --url=<url> --telegramToken=<token> --telegramChatId=<chatId>`

## Licencia

Este proyecto está licenciado bajo la licencia Apache 2.0 - ver el archivo [LICENSE](LICENSE) para más detalles.

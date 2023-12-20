const { DOMParser } = require('@xmldom/xmldom');

/**
 * Fetches the content of a page
 * @param {string} url page url
 * @returns {Promise<string>} page content
 */
async function getPageContent(url) {
  const response = await fetch(url);
  return await response.text();
}

/**
 * Gets the node Elements of the events
 * @param {string} pageContent page content
 * @returns {Array<Element>} event nodes
 */
function getEventsNodes(pageContent) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(pageContent, 'text/html');
  const ulElements = doc.getElementsByClassName('event-list');

  const eventList = Array.from(ulElements).map(x => Array.from(x.getElementsByTagName('li'))).flat();
  if (!eventList.length) {
    console.log('No hay eventos');
    return [];
  }

  const futureEvents = Array.from(eventList).filter(event => {
    const date = event.getElementsByTagName('time')[0];
    if (!date) {
      return false;
    }

    const dateText = date.getAttribute('datetime');
    const dateValue = new Date(dateText);
    const now = new Date();

    return dateValue > now;
  });

  if (!futureEvents.length) {
    console.log('No hay eventos futuros');
    return [];
  }

  return futureEvents;
}

/**
 * Filters the available events
 * @param {Array<Element>} eventNodeList event nodes
 * @returns {Array<Element>} available events
 * @description
 * An event is available if it doesn't contain the text 'entradas agotadas' in its content
 */
function filterAvailableNodes(eventNodeList) {
  const availableEvents = eventNodeList.filter(event => {
    const nodeLowercaseText = event.textContent.toLowerCase();
    return !nodeLowercaseText.includes('entradas agotadas');
  });

  return availableEvents;
}

/**
 * Sends a notification to Telegram with the available events
 * @param {Array<Element>} availableEvents available events
 * @param {Object} options options
 * @param {string} options.telegramToken telegram token
 * @param {string} options.telegramChatId telegram chat id
 * @returns {Promise<void>}
 */
async function sendNotificationToTelegram(availableEvents, options) {
  const botUrl = `https://api.telegram.org/bot${options.telegramToken}/sendMessage`;
  const eventList = Array.from(availableEvents).map(event => {
    const info = event.getElementsByTagName('div')?.[0];
    const date = info?.getElementsByTagName('a')?.[0];
    return '🎟️ ' + date?.toString().replace(` xmlns="${date.namespaceURI}"`, '');
  });

  const text = `Hay <b>${availableEvents.length}</b> eventos disponibles:\n${eventList.join('\n')}`;
  await fetch(botUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: options.telegramChatId, text, parse_mode: 'HTML' }),
  });
}

/**
 * Parses the process arguments and returns an object with the key-value pairs
 * @returns {Object} key-value pairs
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const argsObj = {};

  args
    .map(arg => arg.replace('--', ''))
    .forEach(arg => {
      const [key, value] = arg.split('=');
      argsObj[key] = value;
    });

  return argsObj;
}

/**
 * Runs the script
 * @returns {Promise<void>}
 */
async function run() {
  const options = parseArgs();

  if (!options?.url) {
    console.error('Falta parámetro url');
    return;
  }

  if (!options?.telegramToken) {
    console.error('Falta parámetro telegramToken');
    return;
  }

  if (!options?.telegramChatId) {
    console.error('Falta parámetro telegramChatId');
    return;
  }

  const pageContent = await getPageContent(options.url);
  const futureEvents = getEventsNodes(pageContent);
  const futureAvailableEvents = filterAvailableNodes(futureEvents);

  if (!futureAvailableEvents.length) {
    console.log('No hay eventos disponibles');
    return;
  }

  await sendNotificationToTelegram(futureAvailableEvents, options);
}

run();
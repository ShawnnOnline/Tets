import { createServer } from './server.js';
import { createUI } from './ui.js';

const server = createServer();
const ui = createUI(server);

ui.init();
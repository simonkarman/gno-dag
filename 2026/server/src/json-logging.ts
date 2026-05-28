const originalConsole = {
  log: console.log,
  debug: console.debug,
  info: console.info,
  warn: console.warn,
  error: console.error
};

type Severity = 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR';

function formatLog(...args: unknown[]) {
  const formattedArgs = args.map(arg => {
    if (Array.isArray(arg)) {
      try { return JSON.stringify(arg); } catch (e) { return '[Array]'; }
    } else if (typeof arg === 'string') {
      return arg;
    } else if (arg instanceof Error) {
      return arg.stack || arg.message;
    } else if (typeof arg === 'object' && arg !== null) {
      try { return JSON.stringify(arg); } catch (e) { return `[Object: ${typeof arg}]`; }
    } else {
      return String(arg);
    }
  });
  return formattedArgs.filter(s => s.length > 0).join(' ');
}

function detectSeverity(message: unknown): Severity | null {
  if (typeof message === 'string') {
    if (message.startsWith('[debug]')) return 'DEBUG';
    if (message.startsWith('[info]')) return 'INFO';
    if (message.startsWith('[warn]')) return 'WARNING';
    if (message.startsWith('[error]')) return 'ERROR';
  }
  return null;
}

function createConsoleOverride(defaultSeverity: Severity, logger: (...args: unknown[]) => void) {
  return function (...args: unknown[]) {
    const detectedSeverity = detectSeverity(args[0]);
    const severity = detectedSeverity || defaultSeverity;
    if (detectedSeverity) {
      args[0] = (args[0] as string).replace(/^\[(debug|info|warn|error)]/, '').trim();
    }
    let domain: string | undefined = undefined;
    if (typeof args[0] === 'string' && args[0].startsWith('[')) {
      const match = args[0].match(/^\[(.*?)]/);
      if (match && match[1].length > 0) {
        domain = match[1];
        args[0] = (args[0] as string).replace(/^\[.*?]/, '').trim();
      }
    }
    let subdomain: string | undefined = undefined;
    if (typeof args[0] === 'string' && args[0].startsWith('[')) {
      const match = args[0].match(/^\[(.*?)]/);
      if (match && match[1].length > 0) {
        subdomain = match[1];
        args[0] = (args[0] as string).replace(/^\[.*?]/, '').trim();
      }
    }
    const message = formatLog(...args);
    logger(JSON.stringify({ severity, message, domain, subdomain }));
  };
}

const useJsonLogging = process.env.JSON_LOGGING === 'true';
if (useJsonLogging) {
  console.debug = createConsoleOverride('DEBUG', originalConsole.debug);
  console.log = createConsoleOverride('INFO', originalConsole.log);
  console.info = createConsoleOverride('INFO', originalConsole.info);
  console.warn = createConsoleOverride('WARNING', originalConsole.warn);
  console.error = createConsoleOverride('ERROR', originalConsole.error);
}
console.info(`[info] [server] [json-logging] JSON logging is ${useJsonLogging ? 'enabled' : 'disabled'}`);

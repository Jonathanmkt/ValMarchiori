import pino from 'pino';

// Criar um logger nulo para produção
const nullLogger = {
  info: () => {},
  error: () => {},
  warn: () => {},
  debug: () => {},
  trace: () => {},
  fatal: () => {},
};

// Criar o logger real apenas em desenvolvimento
const devLogger = process.env.NODE_ENV === 'development' 
  ? pino({
      level: 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      },
    })
  : nullLogger;

export default devLogger;
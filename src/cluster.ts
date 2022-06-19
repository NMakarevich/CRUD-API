import cluster from 'cluster';
import * as os from 'os';

const runClaster = async () => {
  if (cluster.isPrimary) {
    const cpusCount = os.cpus().length;
    process.stdout.write(`Primary process ${process.pid} is running\n`);
    for (let i = 0; i < cpusCount - 1; i += 1) {
      const worker = cluster.fork();
      worker.on('exit', () => {
        process.stdout.write(`Worker ${worker.process.pid} died\n`);
        cluster.fork();
      });
    }
  } else {
    await import('./server');
  }
};

runClaster();

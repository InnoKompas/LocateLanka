
import cluster from 'cluster';
import os from 'os';

if (cluster.isPrimary) {
	const numCPUs = os.cpus().length;
	console.log(`Primary process ${process.pid} is running`);
	for (let i = 0; i < numCPUs; i++) {
		cluster.fork();
	}
	cluster.on('exit', (worker, _code, _signal) => {
		console.log(`Worker ${worker.process.pid} died. Restarting...`);
		cluster.fork();
	});
} else {
	require('./server');
}

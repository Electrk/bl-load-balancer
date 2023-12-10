const dgram = require("node:dgram");

class ProxyServer
{
	#port;
	#socket;

	constructor(port, receiveCallback)
	{
		this.#port = port;
		this.#socket = dgram.createSocket("udp4");

		const socket = this.#socket;

		socket.on("error", console.error);
		socket.on("message", receiveCallback);
		socket.on("listening", () =>
		{
			console.log(`Started proxy server on port ${port}`);
		});

		socket.bind(port);
	}

	get port() { return this.#port; }

	send(packet, port, address)
	{
		this.#socket.send(packet, port, address);
	}

	close(callback)
	{
		this.#socket.close(callback);
	}
};

module.exports = ProxyServer;

const ProxyServer = require("./ProxyServer.js");

class Client
{
	#address;
	#port;
	#server;
	#proxy;

	constructor(rawInfo, server, proxyPort, receiveCallback)
	{
		this.#address = rawInfo.address;
		this.#port = rawInfo.port;
		this.#server = server;
		this.#proxy = new ProxyServer(proxyPort, packet => receiveCallback(packet, this));
	}

	get address() { return this.#address; }
	get port() { return this.#port; }
	get proxyPort() { return this.#proxy.port; }

	send(packet)
	{
		this.#proxy.send(packet, this.#server.port, this.#server.address);
	}

	close(callback)
	{
		this.#proxy.close(callback);
	}

	getAddressString()
	{
		return `${this.address}:${this.port}`;
	}

	toJSON()
	{
		return {
			address: this.address,
			port: this.port,
		};
	}
};

module.exports = Client;

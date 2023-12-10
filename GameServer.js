const Client = require("./Client.js");

class GameServer
{
	#address;
	#port;
	#clients;

	constructor(address, port)
	{
		this.#address = address;
		this.#port = port;
		this.#clients = new Map();
	}

	get address() { return this.#address; }
	get port() { return this.#port; }
	get size() { return this.#clients.size; }

	addClient(rawInfo, proxyPort, receiveCallback)
	{
		const client = new Client(rawInfo, this, proxyPort, receiveCallback);

		this.#clients.set(client.getAddressString(), client);

		return client;
	}

	hasClient(client)
	{
		return this.#clients.has(client.getAddressString());
	}

	removeClient(client)
	{
		this.#clients.delete(client.getAddressString());
	}
}

module.exports = GameServer;

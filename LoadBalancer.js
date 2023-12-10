const dgram = require("node:dgram");
const isLocalhost = require("is-localhost-ip");

const GameServer = require("./GameServer.js");
const Client = require("./Client.js");

/**
 * TODO: Handle disconnect packets.
 * TODO: Add time out detection.
 */
class LoadBalancer
{
	#port;
	#servers;
	#clients;
	#nextPort;
	#socket;

	constructor(port, servers)
	{
		this.#port = port;
		this.#servers = servers.map(address => new GameServer(address.address, address.port));
		this.#clients = new Map();
		this.#nextPort = port + 1;
		this.#socket = dgram.createSocket("udp4");

		const socket = this.#socket;

		socket.on("error", console.error);
		socket.on("message", this.#receiveFromClient.bind(this));
		socket.on("listening", () =>
		{
			console.log(`Listening on port ${port}`);
		});
	}

	listen()
	{
		this.#socket.bind(this.#port);
	}

	// ------------------------------------------------

	async #receiveFromClient(packet, rawInfo)
	{
		if (!await this.#isServerAddress(rawInfo))
		{
			const client = this.#hasClient(rawInfo)
				? this.#getClient(rawInfo)
				: await this.#addClient(rawInfo);

			client.send(packet);
		}
	}

	// ------------------------------------------------

	async #addClient(rawInfo)
	{
		const server = await this.#determineServer(rawInfo);
		const client = server.addClient(rawInfo, this.#nextPort++, this.#receiveFromProxy.bind(this));

		this.#clients.set(client.getAddressString(), client);

		return client;
	}

	#hasClient(rawInfo)
	{
		return this.#clients.has(this.#getAddressString(rawInfo));
	}

	#getClient(rawInfo)
	{
		return this.#clients.get(this.#getAddressString(rawInfo)) ?? null;
	}

	#removeClient(rawInfo)
	{
		const client = this.#getClient(rawInfo);

		if (client !== null)
		{
			this.#clients.delete(client.getAddressString());
			this.#servers.forEach(server => server.removeClient(client));

			client.close();
		}
	}

	// ------------------------------------------------

	// TODO: Fill in with your own load balancing algorithm.
	async #determineServer(rawInfo)
	{
		return this.#servers[this.#clients.size % this.#servers.length];
	}

	// ------------------------------------------------

	#receiveFromProxy(packet, client)
	{
		this.#sendToClient(packet, client);
	}

	#sendToClient(packet, client)
	{
		/* We must send it from our public socket instead of the proxy socket or else there will be
		   an address/port mismatch and it won't work. */
		this.#socket.send(packet, client.port, client.address);
	}

	// ------------------------------------------------

	#getAddressString(rawInfoOrClient)
	{
		return (rawInfoOrClient instanceof Client)
			? rawInfoOrClient.getAddressString()
			: `${rawInfoOrClient.address}:${rawInfoOrClient.port}`;
	}

	async #isServerAddress(rawInfo)
	{
		/* The reason we use a separate `isLocalhost()` check is that sometimes the local address
		   is different for some reason... */
		return await isLocalhost(rawInfo.address) && this.#servers.some(server => server.port === rawInfo.port);
	}
};

module.exports = LoadBalancer;

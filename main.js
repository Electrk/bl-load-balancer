const LoadBalancer = require("./LoadBalancer.js");

const servers =
[
	/* TODO: Replace these with the data you want to use! The ports are really the only thing you'll
	         probably want to change. You most likely will still use "127.0.0.1". */
	{ address: "127.0.0.1", port: 4000 },
	{ address: "127.0.0.1", port: 9000 },
];

// TODO: Change `28000` to whatever port you want clients to connect to.
const loadBalancer = new LoadBalancer(28000, servers);

loadBalancer.listen();

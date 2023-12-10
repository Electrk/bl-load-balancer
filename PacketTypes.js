const PacketTypes =
{
	26: "GameHeartbeat",
	28: "ConnectChallengeRequest",
	32: "ConnectChallengeResponse",
	34: "ConnectRequest",
	36: "ConnectReject",
	38: "ConnectAccept",
	40: "Disconnect",
	42: "Punch",
	46: "ArrangedConnectRequest",
	48: "ArrangedConnectNotify",
};

// Two-way mapping to have it act as an enum.
Object.keys(PacketTypes).forEach(key => PacketTypes[PacketTypes[key]] = parseInt(key));

module.exports = PacketTypes;

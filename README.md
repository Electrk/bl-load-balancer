# Blockland Load Balancer

This is a very stupid idea that I came up with and wanted to see if it would work.

This is just a proof-of-concept, so there is absolutely no security, no disconnect handling, no time out detection, no optimizations, or anything like that. I just wanted to see if it was possible, and it is.


## Usage

Clone the repo and type `npm i` to install the one dependency it has.

Then, set up however many Blockland servers you want to run, just make sure they don't post to the master server (how you do this is for you to figure out).

Once you do that, replace the data in the `servers` array in `main.js` with the data you want to use, and, optionally, change the port that the `LoadBalancer` uses. The port that `LoadBalancer` uses is the public-facing port that all clients will connect to.

You can also implement your own load balancing algorithm in `LoadBalancer::determineServer()` if you really want to.

Then, simply run `node main.js` and it should run!

Since this is a proof-of-concept, the load balancer does not post to the master server, so you'll have to implement that. Otherwise, players will have to connect directly to your server via IP and port.


## Notes

**This is not for use in production!!** There are no security checks or optimizations... There are also no disconnect/time out checks, so clients never get removed -- you *will* get memory leaks! This was just for fun :)

This could be used in more ways than just load balancing! That was just the most basic usage of it. You can definitely do a lot more with this concept...

Oh yeah, this also totally breaks `GameConnection::getRawIP()` so that probably isn't great...

Feel free to fork and play around with it! :)

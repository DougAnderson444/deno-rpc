# Deno RPC server

Inspired by [rpcseed](https://github.com/boscoh/rpcseed) and [Snel](https://github.com/crewdevio/Snel)

## Why?

If you want to run untrusted javascript, typescript or webassembly code with your data you might want to consider locking down those scripts in a sandboxed environment, such as what Deno offers. However, we need a way to interact with those script at a safe distance -- keeping the script execution in Deno but showing the results in the browser. 

One of the best ways to do this is using remote procedure calls (RPC). This way we get the convenience of the API offered by the script we are using, but keep the script sandboxed inside Deno.

Since tools like Vercel offer Deno through HTTP requests, I stuck with these instead of websockets. But the concept could easily be extended to websockets, too.

We control the front end scripts, and for the front end I like to use Svelte. For developing Svelte in a Deno environment (vice Nodejs) there aren't a lot of frameworks to choose from, but I thought I'd try out [Snel](https://github.com/crewdevio/Snel). But you could really use any front end framework, or no framework at all. The focus here is on the interact with the Deno script via RPC.

## TODO:

- [ ] Migrate to /api/ to make vercel compatible
- [ ] Import scripts to run (STR) from the net
- [ ] Load data from disk to run through scripts
- [ ] Run the untrusted code in a Deno subprocess with restricted net

## Quick Start

In the command line:

```
# start the snel dev server
trex run start

# start the Deno server
deno run --unstable --allow-net=localhost --allow-read=./ ./server.ts 
```

Then go to `http://localhost:8000`.

## Snel Dev

Snel for Deno is used to develop and build the front-end of this app. To see the Snel readme, go to `frontend/README.md` and see the instructions there. Note that the server port for Snel Dev server is 3000, and Deno server is 8000, so if you want to interact with Deno go to `http://localhost:8000`. 

## Deno Server 

The Deno start tasks are saved in ./.vscode/tasks.json.

To us ethe VS Code tasks to run the Deno server:

`Ctrl+Shift+P > Tasks: Run Task: Deno run server`

or simply copy-paste the task command

```
deno run --unstable --allow-net=localhost --allow-read=./ ./server.ts
```


## Tale of Two Servers

Goto: `localhost:8000`

The snel dev server runs on port 3000 and the Deno server runs on port 8000. If you want the full package, and both are running, navigate to port 8000.
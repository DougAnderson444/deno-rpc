// source: https://github.com/boscoh/rpcseed
import {
  Application,
  Context,
  Router,
  send,
} from "https://deno.land/x/oak/mod.ts"
import { oakCors } from "https://deno.land/x/cors/mod.ts"
import { existsSync } from "https://deno.land/std/fs/mod.ts"
import * as path from "https://deno.land/std@0.90.0/path/mod.ts"
import { parse } from "https://deno.land/std/flags/mod.ts"

// Imports the handlers used in the route /rpc-run
import { handlers } from "./handlers.ts"

const args = parse(Deno.args)
console.dir(args)

let config_fname = "./config.json"
if (args.c) {
  config_fname = args.c
}

const text: any = await Deno.readTextFile(config_fname)
const config: any = JSON.parse(text)

for (let [k, v] of Object.entries(config)) {
  handlers.setConfig(k, v)
}

const clientDir = `./${config.clientDir}`
const socket = `${config.host}:${config.port}`

const app = new Application()
const router = new Router()

router.get("/", async (context) => {
  await send(context, "index.html", { root: `${clientDir}` })
})

router.get("/:path", async (context) => {
  if (context.params?.path) {
    const f = path.join(clientDir, context.params.path)
    // console.log(f, existsSync(f))
    if (existsSync(f)) {
      await send(context, context.params.path, { root: clientDir })
    } else {
      await send(context, "index.html", { root: clientDir })
    }
  }
})

router.post(`/${config.rpcpath}`, async (context: Context) => {
  const body = context.request.body()
  let responseBody: any
  if (body.type === "json") {
    let value = await body.value
    let id = value?.id
    let method = value?.method
    if (!(method in handlers)) {
      const message = `Method not found`
      responseBody = { error: { message, code: -32601 }, jsonrpc: "2.0", id }
    } else {
      try {
        let fn = handlers[method]
        let params = value?.params ? value.params : []
        const paramStr = params ? params.join(",") : ""
        console.log(`rpc-run await ${method}(${paramStr})`)
        const result = await fn(...params)
        responseBody = { result, jsonrpc: "2.0", id }
      } catch (e) {
        responseBody = {
          error: { message: `${e}`, code: -32603 },
          jsonrpc: "2.0",
          id,
        }
      }
    }
  } else {
    responseBody = {
      error: { message: "Parse error", code: -32700 },
      jsonrpc: "2.0",
    }
  }
  context.response.body = responseBody
})

app.use(oakCors())
app.use(router.routes())
app.use(router.allowedMethods())

app.use(async (context) => {
  await send(context, context.request.url.pathname, {
    root: clientDir,
    index: "index.html",
  })
})

app.addEventListener("listen", async () => {
  console.log(`Listening on: http://${socket}/`)

  try {
    const p = Deno.run({
      cmd: ['cmd', '/c', "start", "brave", "http://localhost:8000"],
      stderr: "piped",
      stdout: "piped",
    })
    const [status, stdout, stderr] = await Promise.all([
      p.status(),
      p.output(),
      p.stderrOutput(),
    ])
    const output = new TextDecoder().decode(stdout)
    console.log({ output })
    p.close()
  } catch (error) {
    console.error(error)
  }

  console.log(`Opening browser to: http://${socket}/`)
})

await app.listen(socket)

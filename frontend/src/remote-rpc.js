// import config from "config"; // cant do this until drollup lands

const config = {
  "clientDir": "frontend/public",
  "port": 8000,
  "host": "localhost",
  "rpcpath": "rpc-run"
}

const rpcPort = config.port
const rpcHost = config.host
const rpcpath = config.rpcpath

const  url = `http://${rpcHost}:${rpcPort}/${rpcpath}`

async function rpc (method, ...params) {
  const id = Math.random().toString(36).slice(-6);
  console.log(`rpc-run ${method}:`, params)
  try {
    const payload = { method, params, jsonrpc: '2.0', id }
    if ('electron' in window) {
      return await window.electron.rpc(payload)
    } else {
      const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(payload),
      })
      return await response.json()
    }
  } catch (e) {
    console.log(`rpc-run [fail] ${method} ${e}`)
    return { error: { message: `${e}`, code: -32000 }, jsonrpc: '2.0', id }
  }
}

class RemoteRpcProxy {
    constructor(){
        return new Proxy(this, {
            get(target, prop) {
                return async function() {
                    return await rpc(prop, ...arguments)
                };
            }
        });
    }
}

// window.remote = new RemoteRpcProxy();
export const remote = new RemoteRpcProxy();

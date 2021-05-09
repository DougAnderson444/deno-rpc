// const text: any = await Deno.readTextFile("./config.json")
export default import("./config.json").then((text)=> ( JSON.parse(text) )) // need rollup plugin json

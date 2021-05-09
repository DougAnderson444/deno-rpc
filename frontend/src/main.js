import App from "./App.svelte";
import { remote } from "./remote-rpc.js";

const app = new App({
  target: document.body,
  props: { methods: remote },
});

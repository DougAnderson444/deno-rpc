<script>
  import { onMount } from "svelte";

  export let methods; // prop passed in from main.js

  let answer = "Loading...";

  onMount(async () => {
    const ans = await methods.getAnswer(); // via RPC proxy and Deno server
    answer = ans.result;
  });
</script>

<main>
  <h1>Hello Deno RPC!</h1>
  <p>Here is the value from Web Aseembly in Deno:</p>
  <div class="answer">{answer}</div>
</main>

<style>
  .answer {
    font-size: 2em;
    font-weight: 900;
  }
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>

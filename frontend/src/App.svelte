<script>
  import Home from "@/components/Home.svelte";
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";

  export let methods;

  let answer = "Loading...";

  onMount(async () => {
    const ans = await methods.getAnswer();
    answer = ans.result;
    console.log("ans: ", ans.result);
  });
</script>

<main transition:fade>
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

export default `
<!doctype html>
<html lang=\"en\">

<head>
    <meta charset=\"utf-8\">
    <title>Deno Svelte Server Side App</title>
    <meta name=\"theme-color\" content=\"#1e88e5\">
    <meta name=\"mobile-web-app-capable\" content=\"yes\">
    <meta name=\"apple-mobile-web-app-capable\" content=\"yes\">
    <meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">
    <!-- {{INJECT.HEAD}} -->
</head>

<body>

    <ul id="myList">
    <li>Responses:</li>
    </ul>

    <script type="module">
        import { createRemote } from "https://deno.land/x/gentle_rpc/mod.ts"

        // HTTP
        const remote = createRemote("http://localhost:4500/rpc")
        const greeting = await remote.sayHello(["World"])
        console.log(greeting)

        var node = document.createElement("LI");                 // Create a <li> node
        var textnode = document.createTextNode(greeting);         // Create a text node
        node.appendChild(textnode);                              // Append the text to <li>
        document.getElementById("myList").appendChild(node);     // Append <li> to <ul> with

    </script>
    <!-- {{INJECT.BODY}} -->
</body>

</html>`

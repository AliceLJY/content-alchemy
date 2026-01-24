const res = await fetch('http://127.0.0.1:9222/json/version');
console.log(await res.json());

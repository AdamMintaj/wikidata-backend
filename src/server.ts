import app, { chuj } from "./app.js";

console.log("dupa");
console.log(chuj);

app.listen(3000, () => {
  console.log("started server at port 3000");
});

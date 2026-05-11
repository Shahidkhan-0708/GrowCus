const { createClient } = require("redis");
async function addRedis(req,res){
const client = createClient({
     url: "redis://localhost:6379"
});
client.on("error",(err)=>{
    console.log("redis error:",err);
})
client.connect();
    await client.set("name","shahid");
const value=await client.get("name");
console.log(value);
}
module.exports={addRedis}
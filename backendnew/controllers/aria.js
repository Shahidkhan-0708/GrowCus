const Groq=require("groq-sdk");

const client=new Groq({
     apiKey:process.env.GROQ_API_KEY,
})

async function handleAriaChat(req,res){
const {message}=req.body;
try{
const response =await client.chat.completions.create({
    model:"llama-3.3-70b-versatile",
    max_tokens:1024,
    messages:[
        {role:"system",content:"You are Aria ,an coaching assitant for JEE/NEET students.You motivate students,help them with weak subjects,and keep them on track.Be encouraging and concise."},
        {role:"user",content:message}
    ],
})
const reply=response.choices[0].message.content;
res.status(200).json({reply});
}catch(err){
    console.log(err);
    res.status(403).json({err:"failed to fetch from api"})
}
}
module.exports={handleAriaChat}
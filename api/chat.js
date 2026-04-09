// api/chat.js
export default async function handler(req, res) {
    const API_KEY = process.env.OPENAI_API_KEY;

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // HTMLから送られてきた query (prompt) を取り出す
    const userQuery = req.body.prompt || "BMWのおすすめを教えて";

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "あなたはBMWとJDMの専門家です。エンジニア視点で3つ車種を提案してください。" },
                    { role: "user", content: userQuery }
                ]
            })
        });

        const data = await response.json();
        // シンプルに回答テキストだけを返す
        res.status(200).json({ answer: data.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
export default async function handler(req, res) {
  try {
    const { text } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a British English pronunciation coach. Analyse pronunciation and give concise feedback."
          },
          {
            role: "user",
            content: `Analyse pronunciation for: ${text}`
          }
        ]
      })
    });

    const data = await response.json();

    res.status(200).json({
      result: data.choices[0].message.content
    });

  } catch (error) {
    res.status(500).json({ error: "Failed to analyse pronunciation" });
  }
}

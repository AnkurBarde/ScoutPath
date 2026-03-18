export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { messages } = req.body

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: `You are a helpful Boy Scout merit badge advisor. You know everything about BSA merit badges — which ones are easiest, most fun, most useful for Eagle, and how to complete them. You give short, direct, friendly advice. When recommending badges, be specific about why. Keep responses concise — 2-4 sentences max unless the user asks for more detail.`,
      messages
    })
  })

  const data = await response.json()
  res.status(200).json(data)
}
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Chỉ POST' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Thiếu API Key' });

  try {
    // MODEL NHANH NHẤT + ỔN ĐỊNH
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: req.body.contents || [{ parts: [{ text: req.body.prompt || 'Hello' }] }],  // Format chuẩn
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024  // Giới hạn nhanh hơn
          }
        }),
      }
    );

    const data = await response.json();
    return res.status(response.status).json(data);

  } catch (err) {
    console.error('Gemini error:', err);
    return res.status(500).json({ error: 'Lỗi kết nối Gemini', detail: err.message });
  }
}

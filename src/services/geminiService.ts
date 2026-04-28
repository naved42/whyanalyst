/**
 * Gemini Service — Client-side proxy to server API
 * 
 * All AI calls go through /api/chat and /api/chat/stream on the Express server.
 * The Gemini API key NEVER touches the browser.
 */

export async function generateChatResponse(
  messages: { role: 'user' | 'assistant' | 'system', content: string }[],
  getToken: () => Promise<string | null>,
  agent?: string | null,
  tools?: string[],
  connectors?: string[]
): Promise<string> {
  const token = await getToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ messages, agent, tools, connectors })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || `API error: ${response.status}`);
  }

  const data = await response.json();
  return data.text;
}

export async function generateStreamResponse(
  messages: { role: 'user' | 'assistant' | 'system', content: string }[],
  onChunk: (text: string) => void,
  getToken: () => Promise<string | null>,
  agent?: string | null,
  tools?: string[],
  connectors?: string[]
): Promise<string> {
  const token = await getToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch('/api/chat/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ messages, agent, tools, connectors })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || `API error: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6).trim();
        if (data === '[DONE]') break;
        try {
          const parsed = JSON.parse(data);
          if (parsed.text) {
            fullText += parsed.text;
            onChunk(parsed.text);
          }
          if (parsed.error) {
            throw new Error(parsed.error);
          }
        } catch (e) {
          // Skip malformed chunks
        }
      }
    }
  }

  return fullText;
}

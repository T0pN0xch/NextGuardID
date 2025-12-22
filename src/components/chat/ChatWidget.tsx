import React, { useState, useRef } from 'react';

export type ChatMessage = { id: string; role: 'user' | 'assistant' | 'system'; text: string };

export default function ChatWidget({ title = 'Assistant', autoSummarize = true }: { title?: string; autoSummarize?: boolean }) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const listRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
    };

    const send = async () => {
        if (!input.trim()) return;
        const userMsg: ChatMessage = { id: String(Date.now()), role: 'user', text: input };
        setMessages((m) => [...m, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const proxy = (window as any).__CHAT_PROXY_URL__ || 'http://localhost:3001';
            const res = await fetch(`${proxy}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, userMsg].map((x) => ({ role: x.role, content: x.text })) }),
            });

            if (!res.ok) {
                let bodyText = '';
                try { bodyText = await res.text(); } catch (_) { bodyText = `status ${res.status}`; }
                const errMsg = `Assistant error: ${bodyText}`;
                setMessages((m) => [...m, { id: String(Date.now()), role: 'assistant', text: errMsg }]);
                return;
            }

            const data = await res.json();
            const assistantText = data?.reply || 'No reply';
            const assistantMsg: ChatMessage = { id: String(Date.now() + 1), role: 'assistant', text: assistantText };
            setMessages((m) => [...m, assistantMsg]);
            setTimeout(scrollToBottom, 50);
        } catch (e: any) {
            const errText = e?.message || String(e);
            setMessages((m) => [...m, { id: String(Date.now()), role: 'assistant', text: `Error contacting assistant: ${errText}` }]);
        } finally {
            setLoading(false);
        }
    };

    const summarize = async () => {
        const text = messages.map((m) => `${m.role}: ${m.text}`).join('\n');
        if (!text) return;
        setLoading(true);
        try {
            const proxy = (window as any).__CHAT_PROXY_URL__ || 'http://localhost:3001';
            const res = await fetch(`${proxy}/api/summarize`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text }),
            });
            if (!res.ok) {
                let bodyText = '';
                try { bodyText = await res.text(); } catch (_) { bodyText = `status ${res.status}`; }
                setMessages((m) => [...m, { id: String(Date.now()), role: 'assistant', text: `Summarize error: ${bodyText}` }]);
                return;
            }
            const data = await res.json();
            setMessages((m) => [...m, { id: String(Date.now()), role: 'assistant', text: data.summary || 'No summary' }]);
            setTimeout(scrollToBottom, 50);
        } catch (e) {
            setMessages((m) => [...m, { id: String(Date.now()), role: 'assistant', text: `Summary failed: ${String(e)}` }]);
        } finally {
            setLoading(false);
        }
    };

    // Auto-summarize the page content on mount if requested
    React.useEffect(() => {
        if (!autoSummarize) return;
        (async () => {
            try {
                const main = document.querySelector('main') || document.body;
                let text = main.innerText || '';
                // limit size
                if (text.length > 6000) text = text.slice(0, 6000);
                if (!text.trim()) return;
                setLoading(true);
                const proxy = (window as any).__CHAT_PROXY_URL__ || 'http://localhost:3001';
                const res = await fetch(`${proxy}/api/summarize`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text }),
                });
                const data = await res.json();
                if (data?.summary) {
                    setMessages((m) => [...m, { id: String(Date.now()), role: 'assistant', text: `Page summary: ${data.summary}` }]);
                    setTimeout(scrollToBottom, 100);
                }
            } catch (err) {
                console.error('Auto-summarize failed', err);
            } finally {
                setLoading(false);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="glass-elevated rounded-xl p-4 max-w-xl">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{title}</h3>
                <div className="text-xs text-muted-foreground">AI Chat</div>
            </div>

            <div ref={listRef} className="h-48 overflow-auto border rounded p-2 mb-3 bg-[--card]">
                {messages.length === 0 && <div className="text-sm text-muted-foreground">Ask me about this dashboard or suspicious events.</div>}
                {messages.map((m) => (
                    <div key={m.id} className={`mb-2 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block p-2 rounded ${m.role === 'user' ? 'bg-primary/20' : 'bg-muted'}`}>{m.text}</div>
                    </div>
                ))}
            </div>

            <div className="flex gap-2">
                <input
                    className="flex-1 input px-3 py-2 rounded border"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about this page..."
                    onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
                />
                <button className="btn" onClick={send} disabled={loading}>
                    Send
                </button>
                <button className="btn outline" onClick={summarize} disabled={loading}>
                    Summarize
                </button>
            </div>
        </div>
    );
}

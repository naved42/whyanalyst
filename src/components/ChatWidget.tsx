import { useEffect, useRef, useState } from 'react';
import styles from './ChatWidget.module.css';

/* ── TYPES ── */
interface FaqEntry {
  keys: string[];
  answer: string;
}

interface Message {
  id: number;
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

interface TopicItem {
  label: string;
  text: string;
}

/* ── DATA ── */
const FAQ: FaqEntry[] = [
  { keys: ['free shipping','shipping','delivery','Can I get free shipping within Canada?', 'Do you offer free shipping in Canada?'], answer: "We offer free nationwide shipping within Canada on all orders." },
  { keys: ['hi','hello','hey','hiya','howdy','greetings','good morning','good afternoon','good evening'],
    answer: "Hi! 👋 Welcome to Custom Team Gears! How can I help you today? Whether it's uniforms, pricing, shipping, or anything else — I'm here for you." },
  { keys: ['how are you','how are u','how do you do','hows it going','whats up','sup'],
    answer: "I'm doing great, thanks for asking! 😊 Ready to help you gear up your team. What can I assist you with today?" },
  { keys: ['thank you','thanks','thank u','thx','ty','many thanks','much appreciated','appreciate it'],
    answer: "You're welcome! 😊 It was a pleasure helping you. If you have any more questions, feel free to ask. Go team! 🏆" },
  { keys: ['ok','okay','got it','understood','alright','sounds good','perfect','great','awesome','cool'],
    answer: "Great! 😊 Is there anything else I can help you with? Feel free to ask about our uniforms, pricing, shipping, or anything else." },
  { keys: ['help','i need help','can you help'],
    answer: "Of course! 🙌 I can help with sports uniforms, customization options, pricing, shipping, turnaround times, and more. What would you like to know?" },
  { keys: ['who made you','who built you','are you a bot','are you human','are you ai','are you real'],
    answer: "I'm here to answer your questions 24/7. For complex inquiries, reach our team at 647-482-0545." },
  { keys: ['what is custom team gears','who are you','about','company'],
    answer: "Custom Team Gears is a one-stop source in Canada for high-quality, custom-made team uniforms and sports apparel designed for professional performance." },
  { keys: ['located','address','office','where are you','directions','How can we find you','Where are you located?','Location','Where is your office?'],
    answer: 'Our office is located on Lisbon pines drive Cambridge, ON, Canada N1R8A1, Ontario, N1R8A1, CA' },
  { keys: ['phone','call','number','contact','How can I reach you','How do I contact you','How can I contact you?'],
    answer: "You can reach us at 647-482-0545 or email us at orders@customteamgears.com." },
  { keys: ['email','orders@','contact email','email address','how to email','how do I email','How can i contact you by email?'],
    answer: "Please send order inquiries to orders@customteamgears.com." },

  { keys: ['mission','goal','purpose','what do you do','what is your mission', 'what is your goal','what is your purpose'],
    answer: "Our goal is to provide unique, durable, and high-performance gear to elevate your team's look and boost performance like professionals." },
  { keys: ['basketball'],           answer: "Yes! We offer fully customizable basketball uniforms and jerseys for teams of all levels." },
  { keys: ['baseball'],             answer: "Yes! We provide custom baseball uniforms and pants tailored to your team's specifications." },
  { keys: ['hockey','ice hockey'],  answer: "Yes! We Provides in high-quality ice hockey uniforms and jerseys built for performance." },
  { keys: ['football'],             answer: "Yes! We facilitate custom football uniforms for teams across Canada." },
  { keys: ['soccer','football jersey'], answer: "Yes! Soccer uniforms are one of our core product categories — fully customizable for your club or team." },
  { keys: ['lacrosse'],             answer: "Yes! We provide custom-made lacrosse uniforms and jerseys." },
  { keys: ['volleyball'],           answer: "Yes! Volleyball is included in our 'Design Your Own Sublimation' and general uniform categories." },
  { keys: ['cricket'],              answer: "Yes! We provide custom uniforms specifically designed for cricket teams." },
  { keys: ['softball'],             answer: "Yes! We facilitate custom softball uniforms for teams." },
  { keys: ['tracksuit','track suit'], answer: "Yes! Tracksuits are available as part of our team uniform and off-field apparel selection." },
  { keys: ['hoodie','hoodies'],     answer: "Yes! We offer both standard customized hoodies and sublimated hoodies — great for team unity, especially in winter." },
  { keys: ['polo','polo shirt'],    answer: "Yes! Customized polo shirts are available for teams and staff." },
  { keys: ['t-shirt','tshirt','t shirt'], answer: "Yes! We offer fully customizable T-shirts as part of our off-field apparel solutions." },
  { keys: ['accessories','caps','socks'], answer: "Yes! We provide customized accessories including caps and socks to complete your team's look." },
  { keys: ['training gear','training'], answer: "Yes! We offer specialized gear for training purposes to keep your team prepared." },
  { keys: ['travel gear','travel'], answer: "Our off-field apparel solutions include travel gear designed for comfort and style." },
  { keys: ['sublimation','design your own'], answer: "Our 'Design Your Own Sublimation' service lets you fully customize your gear using sublimation printing." },
  { keys: ['mockup','mock-up','design preview'], answer: "Yes! We provide free design mockups so you can visualize your uniforms before production." },
  { keys: ['portfolio','previous work','past work','examples'], answer: "Yes! View our Work Portfolio on the website — we've worked with the Eastern Basketball Association, Rhino Hockey, and many more." },
  { keys: ['catalog','catalogue','products list'], answer: "Yes! A product catalog is available through our quick links on the website." },
  { keys: ['quote','price','pricing','cost','how much'], answer: "Click 'Get a FREE QUOTE' on our website or use the Inquiry link. We offer market-competitive pricing!" },
  { keys: ['turnaround','production time','lead time'], answer: "Orders typically have a 3–4 week turnaround time from design approval to delivery." },
  { keys: ['bulk','bulk discount','large order'], answer: "Yes! We provide custom deals and discounts on bulk orders of premium uniforms and jerseys." },
  { keys: ['urgent','rush','fast','quick order'], answer: "Yes! We can handle urgent orders and deliver professionally on time." },
  { keys: ['schools','college','university','educational'], answer: "Yes! We are trusted by top schools and college teams throughout Canada." },
  { keys: ['quality','material','fabric','durable'], answer: "Our gear uses premium, high-quality, durable materials built to withstand active play." },
  { keys: ['clients','who have you worked with'], answer: "We've worked with the Eastern Basketball Association, Rhino Hockey, and many others across Canada." },
  { keys: ['customer service','support','service'], answer: "Customers describe our service as 'outstanding,' 'professional,' and 'easy to talk to.'" },
  { keys: ['reviews','testimonials','feedback','what do customers say',], answer: "Customers love our fit — reviews call it 'awesome,' 'good,' and 'great.' Service is consistently outstanding." },
  { keys: ['blog','articles','trends','tips'], answer: "Check our blog for 'Top Trends in Custom Sports Apparel for 2026,' the psychology of team uniforms, and more." },
  { keys: ['performance','boost performance'], answer: "The right fabric and custom gear can significantly boost your team's performance and confidence." },
  { keys: ['chat','live chat','talk to someone'], answer: "Reach us at 647-482-0545 or orders@customteamgears.com — we're happy to help!" },
  { keys: ['instagram','facebook','linkedin','social','social media','follow','follow us'], answer: 'SOCIAL_LINKS' },
];

const FALLBACK =
  "I'm sorry, I don't have that info right now. Please contact us at 647-482-0545 or email orders@customteamgears.com — we'd love to help! 😊";

const TOPICS: TopicItem[] = [
  { label: '🏒 Hockey',        text: 'Do you make hockey uniforms?' },
  { label: '⚽ Soccer',         text: 'Do you make soccer uniforms?' },
  { label: '🏀 Basketball',     text: 'Do you make basketball jerseys?' },
  { label: '🚚 Free Shipping',  text: 'Do you offer free shipping?' },
  { label: '💰 Get a Quote',    text: 'How do I get a price quote?' },
  { label: '📍 Location',       text: 'Where are you located?' },
  { label: '⏱ Turnaround',     text: 'What is the turnaround time?' },
  { label: '📱 Social Media',   text: 'Follow you on social media?' },
];

const PLACEHOLDERS: string[] = [
  'How can I reach you?',
  'Do you offer free shipping in Canada?',
  'What sports do you cover?',
  'How long is the turnaround time?',
  'Can I see a design mockup?',
  'Do you do bulk orders?',
  "What's your contact number?",
  'Do you make soccer jerseys?',
  'How can I find  you social media?',
  'How do I get a free quote?',

];

/* ── HELPERS ── */
function normalize(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
}

function getAnswer(text: string): string {
  const clean = normalize(text);
  for (const e of FAQ) {
    if (e.keys.some((k) => clean.includes(k))) return e.answer;
  }
  const words = clean.split(/\s+/).filter((w) => w.length > 3);
  for (const e of FAQ) {
    if (e.keys.some((k) => words.some((w) => k.includes(w)))) return e.answer;
  }
  return FALLBACK;
}

function timestamp(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/* ── BUBBLE CONTENT ── */
function BubbleContent({ text }: { text: string }) {



  if (text === 'SOCIAL_LINKS') {
    return (
      <div>
        <p style={{ marginBottom: 10 }}>Follow us on our social channels! </p>
        <div className={styles.socialLinks}>
          <a href="https://www.instagram.com/customteamgears/"
             target="_blank" rel="noopener noreferrer"
             className={`${styles.socialBtn} ${styles.ig}`}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Instagram
          </a>
          <a href="https://www.linkedin.com/company/custom-team-gears/"
             target="_blank" rel="noopener noreferrer"
             className={`${styles.socialBtn} ${styles.li}`}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </a>
        </div>
      </div>
    );
  }

  return <span>{text}</span>;
}

/* ── MAIN COMPONENT ── */
export default function ChatWidget() {
  const [isOpen, setIsOpen]     = useState<boolean>(false);
  const [welcomed, setWelcomed] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]       = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [phText, setPhText]     = useState<string>('');
  const [showPh, setShowPh]     = useState<boolean>(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLInputElement>(null);
  const phIndex        = useRef<number>(0);
  const charIndex      = useRef<number>(0);
  const isDeleting     = useRef<boolean>(false);
  const typeTimer      = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── auto scroll ── */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  /* ── typing placeholder ── */
  useEffect(() => {
    if (!isOpen) return;

    const typeLoop = () => {
      if (document.activeElement === inputRef.current || input.length > 0) {
        setShowPh(false);
        typeTimer.current = setTimeout(typeLoop, 300);
        return;
      }
      setShowPh(true);
      const full = PLACEHOLDERS[phIndex.current];
      if (!isDeleting.current) {
        charIndex.current++;
        setPhText(full.slice(0, charIndex.current));
        if (charIndex.current === full.length) {
          isDeleting.current = true;
          typeTimer.current = setTimeout(typeLoop, 2800);
          return;
        }
        typeTimer.current = setTimeout(typeLoop, 55);
      } else {
        charIndex.current--;
        setPhText(full.slice(0, charIndex.current));
        if (charIndex.current === 0) {
          isDeleting.current = false;
          phIndex.current = (phIndex.current + 1) % PLACEHOLDERS.length;
          typeTimer.current = setTimeout(typeLoop, 400);
          return;
        }
        typeTimer.current = setTimeout(typeLoop, 28);
      }
    };

    typeTimer.current = setTimeout(typeLoop, 800);
    return () => {
      if (typeTimer.current) clearTimeout(typeTimer.current);
    };
  }, [isOpen]);

  /* ── open / close ── */
  function toggleChat(): void {
    const next = !isOpen;
    setIsOpen(next);

    if (next && !welcomed) {
      setWelcomed(true);
      setTimeout(() => {
        setMessages([{
          id: Date.now(),
          sender: 'bot',
          time: timestamp(),
          text: "Hi there! 👋 Welcome to Custom Team Gears — Canada's trusted Sporting Goods Manufacturing company for custom team uniforms and sports apparel. Ask me anything about our products, pricing, shipping, and more!",
        }]);
      }, 350);
    }

    if (next) setTimeout(() => inputRef.current?.focus(), 400);
  }

  /* ── send ── */
  function send(text: string): void {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: 'user', text: trimmed, time: timestamp() },
    ]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'bot', text: getAnswer(trimmed), time: timestamp() },
      ]);
    }, 700 + Math.random() * 400);
  }

  const today = new Date().toLocaleDateString([], {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  return (
    <>
      {/* ── LAUNCHER ── */}
      <button className={styles.launcher} onClick={toggleChat} aria-label="Toggle support chat">
        {!isOpen ? (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        )}
        {!isOpen && !welcomed && <span className={styles.badge}>1</span>}
      </button>

      {/* ── PANEL ── */}
      <div
        className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Support Chat"
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.hdrRow}>
            <div className={styles.avatarWrap}>
              <div className={styles.avatar}>🏆</div>
              <span className={styles.onlineDot} />
            </div>
            <div>
              <div className={styles.hdrName}>Custom Team Gears</div>
              <div className={styles.hdrSub}>Support Bot · Typically replies instantly</div>
              <div className={styles.hdrTag}>⚙️ Sporting Goods Manufacturing</div>
            </div>
          </div>
        </div>

        {/* Topics */}
        <div className={styles.topics}>
          {TOPICS.map((t) => (
            <button key={t.label} className={styles.chip} onClick={() => send(t.text)}>
              {t.label}
            </button>
          ))}
        </div>
        <div className={styles.divider} />

        {/* Messages */}
        <div className={styles.messages}>
          <div className={styles.dateSep}>{today}</div>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`${styles.msgRow} ${msg.sender === 'user' ? styles.msgUser : styles.msgBot}`}
            >
              <div className={styles.msgAvatar}>{msg.sender === 'bot' ? '🏆' : '👤'}</div>
              <div className={`${styles.bubbleCol} ${msg.sender === 'user' ? styles.bubbleColUser : ''}`}>
                <div className={msg.sender === 'bot' ? styles.bubbleBot : styles.bubbleUser}>
                  <BubbleContent text={msg.text} />
                </div>
                <div className={styles.msgTime}>{msg.time}</div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className={`${styles.msgRow} ${styles.msgBot}`}>
              <div className={styles.msgAvatar}>🏆</div>
              <div className={styles.typingBubble}>
                <span className={styles.dot} style={{ animationDelay: '0s' }} />
                <span className={styles.dot} style={{ animationDelay: '0.2s' }} />
                <span className={styles.dot} style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className={styles.inputArea}>
          <div className={styles.inputWrapper}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send(input)}
              onFocus={() => setShowPh(false)}
              onBlur={() => { if (!input) setShowPh(true); }}
              className={styles.input}
              aria-label="Type your message"
            />
            {showPh && !input && (
              <span className={styles.placeholder}>
                {phText}<span className={styles.cursor} />
              </span>
            )}
          </div>
          <button className={styles.sendBtn} onClick={() => send(input)} aria-label="Send">
            <svg viewBox="0 0 24 24" width="17" height="17" fill="#fff">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>

        <div className={styles.footer}>
          Powered by{' '}
          <a href="https://www.customteamgears.com" target="_blank" rel="noopener noreferrer">
            customteamgears.com
          </a>
        </div>
      </div>
    </>
  );
}
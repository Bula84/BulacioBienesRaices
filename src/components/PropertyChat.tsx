'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Minimize2 } from 'lucide-react';
import {
    Propiedad,
    ChatMessage,
    createChatConversation,
    sendAgentMessage,
    updateChatConversation,
} from '@/lib/supabase';

interface PropertyChatProps {
    property: Propiedad;
}

export default function PropertyChat({ property }: PropertyChatProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [typing, setTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, typing]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Generate local fallback greeting using property data
    const generateLocalGreeting = (): string => {
        return `¡Hola! 👋 Soy el asistente de BC BienesRaíces.\n\nEstás consultando por:\n🏠 ${property.title}\n📍 ${property.address || 'Ubicación por confirmar'}\n💰 USD ${property.price?.toLocaleString('es-AR') || 'Consultar'}\n\n¿En qué puedo ayudarte?`;
    };

    // Generate local fallback response for when Edge Function is unavailable
    const generateLocalResponse = (msg: string): string => {
        const lower = msg.toLowerCase();

        if (lower.includes('expensa')) {
            return property.expensas
                ? `Las expensas de esta propiedad son de $${property.expensas.toLocaleString('es-AR')}/mes. ¿Tenés alguna otra consulta? 😊`
                : 'Las expensas no están publicadas en este momento. Voy a consultar con el corredor y te aviso. ¿Te puedo ayudar con algo más?';
        }
        if (lower.includes('precio') || lower.includes('valor') || lower.includes('cuanto') || lower.includes('cuesta')) {
            return `El precio es USD ${property.price?.toLocaleString('es-AR') || 'a consultar'}.${property.expensas ? ' Expensas: $' + property.expensas.toLocaleString('es-AR') + '/mes.' : ''} ¿Te gustaría coordinar una visita? 🏠`;
        }
        if (lower.includes('garantia') || lower.includes('caucion') || lower.includes('requisito') || lower.includes('finaer')) {
            const req = property.requisitos || 'Garantía propietaria o seguro de caución (Finaer, Porto, etc.)';
            return `Los requisitos para esta propiedad son:\n📋 ${req}\n\n¿Contás con alguno de estos? ✅`;
        }
        if (lower.includes('visita') || lower.includes('ver') || lower.includes('conocer') || lower.includes('agenda')) {
            return '¡Genial! Para coordinar la visita necesito tus datos:\n\n📝 Nombre completo\n📞 Teléfono\n📧 Email\n\nHorarios disponibles: Lunes a Viernes 10-18hs, Sábados 10-13hs.';
        }
        if (lower.includes('ubicaci') || lower.includes('direcci') || lower.includes('donde') || lower.includes('dónde')) {
            return `La propiedad está ubicada en:\n📍 ${property.address || 'Dirección exacta a confirmar'}, ${property.neighborhood || ''}, ${property.city || ''}\n\n¿Te gustaría coordinar una visita? 🏠`;
        }
        if (lower.includes('detalle') || lower.includes('característica') || lower.includes('tiene') || lower.includes('info')) {
            let d = `📋 Detalles de ${property.title}:\n`;
            if (property.m2) d += `• ${property.m2} m² totales`;
            if (property.m2_covered) d += ` / ${property.m2_covered} m² cubiertos`;
            d += '\n';
            if (property.bedrooms) d += `• ${property.bedrooms} dormitorios\n`;
            if (property.bathrooms) d += `• ${property.bathrooms} baños\n`;
            if (property.parking) d += `• ${property.parking} cochera(s)\n`;
            d += `\n${property.description || ''}\n\n¿Te interesa coordinar una visita? 🏠`;
            return d;
        }
        return `Gracias por tu consulta.\n\nPuedo ayudarte con:\n• 💰 Precio y expensas\n• 📋 Requisitos y garantías\n• 📍 Ubicación\n• 🏠 Características\n• 📅 Agendar visita\n\n¿Qué te gustaría saber?`;
    };

    const initConversation = async (): Promise<string | null> => {
        if (conversationId) return conversationId;
        try {
            const conv = await createChatConversation(property.id);
            if (conv) {
                setConversationId(conv.id);
                return conv.id;
            }
        } catch {
            // Property doesn't exist in DB (demo/mock) — continue in local mode
        }
        return null;
    };

    const handleOpen = async () => {
        setIsOpen(true);
        if (messages.length === 0) {
            setTyping(true);
            const convId = await initConversation();

            if (convId) {
                // Real property — call Edge Function
                const result = await sendAgentMessage(convId, property.id, 'Hola', []);
                setTyping(false);
                if (result?.reply) {
                    setMessages([{ role: 'assistant', content: result.reply, timestamp: new Date().toISOString() }]);
                    return;
                }
            }

            // Fallback — generate greeting locally
            await new Promise(r => setTimeout(r, 600));
            setTyping(false);
            setMessages([{ role: 'assistant', content: generateLocalGreeting(), timestamp: new Date().toISOString() }]);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || sending) return;

        const userMessage: ChatMessage = {
            role: 'user',
            content: input.trim(),
            timestamp: new Date().toISOString(),
        };

        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setSending(true);
        setTyping(true);

        try {
            let convId = conversationId;
            if (!convId) {
                convId = await initConversation();
            }

            if (convId) {
                // Real property — call Edge Function
                const result = await sendAgentMessage(convId, property.id, userMessage.content, messages);
                if (result?.reply) {
                    const assistantMsg: ChatMessage = {
                        role: 'assistant',
                        content: result.reply,
                        timestamp: new Date().toISOString(),
                    };
                    setMessages([...newMessages, assistantMsg]);

                    // Extract contact info from conversation
                    const fullText = [...newMessages, assistantMsg].map(m => m.content).join(' ');
                    const emailMatch = fullText.match(/[\w.-]+@[\w.-]+\.\w+/);
                    const phoneMatch = fullText.match(/(?:\+?\d{1,3}[-.\s]?)?\d{6,14}/);
                    if (emailMatch || phoneMatch) {
                        await updateChatConversation(convId, {
                            visitor_email: emailMatch?.[0],
                            visitor_phone: phoneMatch?.[0],
                        });
                    }
                    return;
                }
            }

            // Fallback — generate response locally
            await new Promise(r => setTimeout(r, 800));
            setMessages([...newMessages, {
                role: 'assistant',
                content: generateLocalResponse(userMessage.content),
                timestamp: new Date().toISOString(),
            }]);
        } catch (error) {
            console.error('Error:', error);
            setMessages([...newMessages, {
                role: 'assistant',
                content: 'Disculpá, hubo un inconveniente técnico. ¿Podés intentar de nuevo? 🙏',
                timestamp: new Date().toISOString(),
            }]);
        } finally {
            setSending(false);
            setTyping(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Floating Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleOpen}
                        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl shadow-teal-500/40 group"
                        style={{
                            background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                        }}
                    >
                        <MessageCircle className="w-7 h-7 text-white" />
                        {/* Pulse animation */}
                        <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-teal-400" />
                        {/* Label */}
                        <span className="absolute -top-10 right-0 bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                            💬 Consultá ahora
                        </span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed bottom-4 right-4 z-50 w-[380px] max-w-[calc(100vw-2rem)] rounded-3xl overflow-hidden shadow-2xl shadow-black/20 flex flex-col"
                        style={{
                            height: 'min(580px, calc(100vh - 2rem))',
                            border: '1px solid rgba(0,0,0,0.08)',
                        }}
                    >
                        {/* Header */}
                        <div
                            className="flex items-center gap-3 px-5 py-4 flex-shrink-0"
                            style={{
                                background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 100%)',
                            }}
                        >
                            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white font-bold text-sm">Asistente BC BienesRaíces</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                                    <span className="text-teal-100 text-xs font-medium">En línea</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                                >
                                    <Minimize2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Property Tag */}
                        <div className="px-4 py-2.5 bg-teal-50 border-b border-teal-100 flex-shrink-0">
                            <p className="text-xs font-bold text-teal-700 truncate">
                                🏠 {property.title}
                            </p>
                            <p className="text-xs text-teal-600">
                                USD {property.price?.toLocaleString('es-AR')} · {property.operation === 'venta' ? 'Venta' : 'Alquiler'}
                            </p>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50" style={{ scrollBehavior: 'smooth' }}>
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {msg.role === 'assistant' && (
                                        <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-1">
                                            <Bot className="w-3.5 h-3.5 text-teal-700" />
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${msg.role === 'user'
                                            ? 'bg-[#0d9488] text-white rounded-br-md'
                                            : 'bg-white text-[var(--text-main)] rounded-bl-md shadow-sm border border-gray-100'
                                            }`}
                                    >
                                        {msg.content}
                                    </div>
                                    {msg.role === 'user' && (
                                        <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 mt-1">
                                            <User className="w-3.5 h-3.5 text-slate-600" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}

                            {/* Typing indicator */}
                            {typing && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex gap-2 items-end"
                                >
                                    <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-3.5 h-3.5 text-teal-700" />
                                    </div>
                                    <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-100">
                                        <div className="flex gap-1.5">
                                            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="px-4 py-3 bg-white border-t border-gray-100 flex-shrink-0">
                            <div className="flex items-center gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Escribí tu consulta..."
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-[var(--text-main)] placeholder:text-gray-400 focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-teal-100 transition-all"
                                    disabled={sending}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || sending}
                                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 hover:scale-105"
                                    style={{
                                        background: input.trim() ? 'linear-gradient(135deg, #0d9488, #0f766e)' : '#e5e7eb',
                                    }}
                                >
                                    <Send className={`w-4 h-4 ${input.trim() ? 'text-white' : 'text-gray-400'}`} />
                                </button>
                            </div>
                            <p className="text-center text-[10px] text-gray-400 mt-2 font-medium">
                                Asistente IA · BC BienesRaíces
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

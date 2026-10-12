'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, Send, Bot, User, Sparkles } from 'lucide-react';
import { ChatMessage, sendLegalChat } from '@/lib/supabase';

interface Props {
    /** El asistente avisa acá cuando arma el resumen del caso. */
    onResumen?: (resumen: string) => void;
    /** Datos ya cargados en el formulario, para dar contexto al asistente. */
    contexto?: string;
}

const GREETING: ChatMessage = {
    role: 'assistant',
    content:
        'Hola 👋 Soy el asistente de Gestión Legal de Bulacio Bienes Raíces.\n\nTrabajamos con cobranza de mora en instancia extrajudicial y judicial, y asesoramiento jurídico.\n\nPara derivarte con un asesor, contame: ¿quién consulta (propietario, inmobiliaria o administración)?',
    timestamp: new Date().toISOString(),
};

export default function LegalAssistant({ onResumen, contexto }: Props) {
    const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const [resumenListo, setResumenListo] = useState<string | null>(null);
    const endRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, sending]);

    const handleSend = async () => {
        const text = input.trim();
        if (!text || sending) return;

        const userMsg: ChatMessage = {
            role: 'user',
            content: text,
            timestamp: new Date().toISOString(),
        };
        const history = [...messages, userMsg];
        setMessages(history);
        setInput('');
        setSending(true);

        const result = await sendLegalChat(text, contexto ? [...history] : history);
        setSending(false);

        if (!result?.reply) {
            setMessages([
                ...history,
                {
                    role: 'assistant',
                    content:
                        'No pude procesar la consulta en este momento. Dejame tus datos en el formulario de al lado y un asesor te contacta a la brevedad.',
                    timestamp: new Date().toISOString(),
                },
            ]);
            return;
        }

        setMessages([
            ...history,
            { role: 'assistant', content: result.reply, timestamp: new Date().toISOString() },
        ]);

        if (result.resumen) {
            setResumenListo(result.resumen);
            onResumen?.(result.resumen);
        }
    };

    return (
        <div
            className="rounded-3xl overflow-hidden shadow-xl flex flex-col h-[560px] border border-slate-200 bg-white"
            style={{ ['--tw-shadow-color' as string]: 'rgba(11,31,58,0.15)' }}
        >
            {/* Header — sub-marca Gestión Legal */}
            <div
                className="flex items-center gap-3 px-5 py-4 flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #0b1f3a 0%, #16345c 100%)' }}
            >
                <div className="w-10 h-10 rounded-xl bg-[#b8863b]/20 flex items-center justify-center">
                    <Scale className="w-5 h-5 text-[#e3b872]" />
                </div>
                <div className="flex-1">
                    <h3 className="text-white font-bold text-sm">Asistente Gestión Legal</h3>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-slate-300 text-xs font-medium">En línea</span>
                    </div>
                </div>
                <Sparkles className="w-4 h-4 text-[#b8863b]" />
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50">
                {messages.map((msg, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        {msg.role === 'assistant' && (
                            <div className="w-7 h-7 rounded-full bg-[#0b1f3a] flex items-center justify-center flex-shrink-0 mt-1">
                                <Bot className="w-3.5 h-3.5 text-[#e3b872]" />
                            </div>
                        )}
                        <div
                            className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                                msg.role === 'user'
                                    ? 'bg-[#0b1f3a] text-white rounded-br-md'
                                    : 'bg-white text-slate-800 rounded-bl-md shadow-sm border border-slate-200'
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

                {sending && (
                    <div className="flex gap-2 items-end">
                        <div className="w-7 h-7 rounded-full bg-[#0b1f3a] flex items-center justify-center">
                            <Bot className="w-3.5 h-3.5 text-[#e3b872]" />
                        </div>
                        <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-slate-200">
                            <div className="flex gap-1.5">
                                {[0, 150, 300].map((d) => (
                                    <span
                                        key={d}
                                        className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"
                                        style={{ animationDelay: `${d}ms` }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <div ref={endRef} />
            </div>

            {/* Aviso de resumen listo */}
            <AnimatePresence>
                {resumenListo && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-4 py-3 bg-[#b8863b]/10 border-t border-[#b8863b]/30 flex-shrink-0"
                    >
                        <p className="text-xs font-bold text-[#7c5a22]">
                            ✅ Caso listo para derivar — completá el formulario con tus datos y envialo.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Input */}
            <div className="px-4 py-3 bg-white border-t border-slate-200 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder="Escribí tu consulta..."
                        className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder:text-slate-500 focus:outline-none focus:border-[#0b1f3a] focus:ring-2 focus:ring-[#0b1f3a]/10 transition-all"
                        disabled={sending}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || sending}
                        aria-label="Enviar mensaje"
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 hover:scale-105"
                        style={{
                            background: input.trim() ? '#0b1f3a' : '#e2e8f0',
                        }}
                    >
                        <Send className={`w-4 h-4 ${input.trim() ? 'text-[#e3b872]' : 'text-slate-400'}`} />
                    </button>
                </div>
                <p className="text-center text-[0.8125rem] text-slate-500 mt-2 font-medium">
                    Asistente IA · no sustituye el asesoramiento jurídico profesional
                </p>
            </div>
        </div>
    );
}

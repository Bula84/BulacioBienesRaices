'use client';

import React, { useState, useEffect } from 'react';
import { Calculator, Copy, Check, TrendingUp, Calendar, DollarSign, Info } from 'lucide-react';

// Simulated API Call to fetch index data
const fetchIndexData = async () => {
    // In a real scenario, this would be an API call to your backend or an external source like BCRA
    return new Promise<{ ICL: Record<string, number>, IPC: Record<string, number> }>((resolve) => {
        setTimeout(() => {
            resolve({
                ICL: {
                    '2022-01': 1.69, '2022-02': 1.76, '2022-03': 1.84, '2022-04': 1.93, '2022-05': 2.05, '2022-06': 2.16, '2022-07': 2.27, '2022-08': 2.42, '2022-09': 2.58, '2022-10': 2.75, '2022-11': 2.92, '2022-12': 3.10,
                    '2023-01': 3.32, '2023-02': 3.49, '2023-03': 3.70, '2023-04': 3.97, '2023-05': 4.25, '2023-06': 4.60, '2023-07': 4.98, '2023-08': 5.40, '2023-09': 5.92, '2023-10': 6.57, '2023-11': 7.22, '2023-12': 8.16,
                    '2024-01': 10.36, '2024-02': 12.39, '2024-03': 14.88, '2024-04': 16.71, '2024-05': 18.25, '2024-06': 19.83, '2024-07': 21.05, '2024-08': 22.18, '2024-09': 23.23, '2024-10': 24.16, '2024-11': 25.01, '2024-12': 25.80,
                    '2025-01': 26.65, '2025-02': 27.50, '2025-03': 28.32, // Example projections
                },
                IPC: {
                    // Represented as indices relative to a base month (e.g. Dec 2016=100)
                    '2022-01': 845.2, '2022-02': 884.9, '2022-03': 944.3, '2022-04': 1001.0, '2022-05': 1052.1, '2022-06': 1107.8, '2022-07': 1190.1, '2022-08': 1273.4, '2022-09': 1352.3, '2022-10': 1437.5, '2022-11': 1507.9, '2022-12': 1584.8,
                    '2023-01': 1680.6, '2023-02': 1791.5, '2023-03': 1929.5, '2023-04': 2091.6, '2023-05': 2254.8, '2023-06': 2389.5, '2023-07': 2541.2, '2023-08': 2858.9, '2023-09': 3221.9, '2023-10': 3489.3, '2023-11': 3935.1, '2023-12': 4938.8,
                    '2024-01': 5956.2, '2024-02': 6742.4, '2024-03': 7484.1, '2024-04': 8142.7, '2024-05': 8484.7, '2024-06': 8875.0, '2024-07': 9230.0, '2024-08': 9617.7, '2024-09': 9954.3, '2024-10': 10223.1, '2024-11': 10560.5, '2024-12': 10845.6,
                    '2025-01': 11138.4, '2025-02': 11450.3, '2025-03': 11759.4, // Example projections
                }
            });
        }, 600);
    });
};

// Formatter for currency
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        maximumFractionDigits: 0
    }).format(amount);
};

export default function CalculadoraAlquileresPage() {
    const [indexType, setIndexType] = useState<'ICL' | 'IPC'>('ICL');
    const [initialAmount, setInitialAmount] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [adjustmentMonths, setAdjustmentMonths] = useState<string>('12');

    const [indicesData, setIndicesData] = useState<{ ICL: Record<string, number>, IPC: Record<string, number> } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchIndexData().then(data => {
            setIndicesData(data);
            setIsLoading(false);
        });
    }, []);

    const calculateUpdate = () => {
        if (!initialAmount || !startDate || !adjustmentMonths || !indicesData) return null;
        setError(null);

        const amount = parseFloat(initialAmount);
        if (isNaN(amount) || amount <= 0) return null;

        // Parse start date from YYYY-MM
        const [startYearStr, startMonthStr] = startDate.split('-');
        const startYear = parseInt(startYearStr, 10);
        const startMonthNum = parseInt(startMonthStr, 10);
        const startKey = `${startYear}-${String(startMonthNum).padStart(2, '0')}`;

        // Calculate end date key by adding months
        let endMonthNum = startMonthNum + parseInt(adjustmentMonths, 10);
        let endYear = startYear;

        while (endMonthNum > 12) {
            endMonthNum -= 12;
            endYear += 1;
        }
        const endKey = `${endYear}-${String(endMonthNum).padStart(2, '0')}`;

        const dataSet = indicesData[indexType];

        // Check if dates are inside dataset
        const startIdx = dataSet[startKey];
        let endIdx = dataSet[endKey];
        let actualEndKey = endKey;

        if (!startIdx) {
            setError(`No hay datos del índice ${indexType} para la fecha de inicio (${startKey}).`);
            return null;
        }
        if (!endIdx) {
            // Fallback to latest available month
            const keys = Object.keys(dataSet).sort();
            const latestKey = keys[keys.length - 1];
            if (endKey > latestKey) {
                endIdx = dataSet[latestKey];
                actualEndKey = latestKey;
                setError(`Atención: No hay datos para el mes final, se utilizó el último mes disponible (${latestKey}).`);
            } else {
                setError(`Faltan datos en la base histórica para el mes final (${endKey}).`);
                return null;
            }
        }

        const newAmount = amount * (endIdx / startIdx);
        const increasePercentage = ((endIdx / startIdx) - 1) * 100;

        return {
            newAmount,
            increasePercentage,
            oldAmount: amount,
            startKey,
            endKey: actualEndKey,
            startIdx,
            endIdx
        };
    };

    const result = calculateUpdate();

    const getWhatsappMessage = () => {
        if (!result) return '';
        const { oldAmount, newAmount, increasePercentage, startKey, endKey } = result;
        return `Hola! 👋 Te escribo para informarte la actualización de tu contrato de alquiler para el próximo período.

📊 *Detalles:*
• Índice utilizado: ${indexType}
• Periodo tomado: ${startKey} a ${endKey}
• Porcentaje de aumento: ${increasePercentage.toFixed(2)}%

💰 *Valores:*
• Alquiler actual: ${formatCurrency(oldAmount)}
• Nuevo monto a abonar: ${formatCurrency(newAmount)}

Quedamos a tu disposición por cualquier consulta. ¡Saludos!`;
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(getWhatsappMessage());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-[var(--primary-blue)] rounded-full animate-spin mx-auto" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-teal-50 border border-teal-100">
                    <Calculator className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-main)] font-headings">Calculadora de Actualización de Alquileres</h1>
                    <p className="text-[var(--text-secondary)] font-medium">Herramienta profesional para calcular los ajustes contractuales</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Form */}
                <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <h2 className="text-xl font-bold text-[var(--text-main)] mb-6">Parámetros del Ajuste</h2>

                    <div className="space-y-6">
                        {/* Index Selector */}
                        <div>
                            <label className="block text-sm font-bold text-[var(--text-secondary)] mb-3">Índice a utilizar</label>
                            <div className="flex gap-4">
                                <label className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${indexType === 'ICL' ? 'border-[#0d9488] bg-teal-50 text-teal-800 font-bold' : 'border-gray-100 text-gray-500 hover:border-teal-200'}`}>
                                    <input type="radio" value="ICL" checked={indexType === 'ICL'} onChange={() => setIndexType('ICL')} className="hidden" />
                                    ICL (Contratos Ley 27.551)
                                </label>
                                <label className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${indexType === 'IPC' ? 'border-[#0d9488] bg-teal-50 text-teal-800 font-bold' : 'border-gray-100 text-gray-500 hover:border-teal-200'}`}>
                                    <input type="radio" value="IPC" checked={indexType === 'IPC'} onChange={() => setIndexType('IPC')} className="hidden" />
                                    IPC (Inflación)
                                </label>
                            </div>
                        </div>

                        {/* Inputs */}
                        <div>
                            <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Monto actual del alquiler</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <DollarSign className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="number"
                                    value={initialAmount}
                                    onChange={(e) => setInitialAmount(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Ej: 150000"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Mes de inicio</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Calendar className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="month"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Ajuste cada</label>
                                <select
                                    value={adjustmentMonths}
                                    onChange={(e) => setAdjustmentMonths(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                                >
                                    <option value="3">3 meses</option>
                                    <option value="4">4 meses</option>
                                    <option value="6">6 meses</option>
                                    <option value="12">12 meses (Anual)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Results */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-[#0d9488] to-[#0f766e] rounded-[2rem] p-8 shadow-xl text-white relative overflow-hidden">
                        {/* Decorative circle */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>

                        <h2 className="text-xl font-bold mb-6 text-teal-50">Resultado del Cálculo</h2>

                        {error && (
                            <div className="bg-red-500/20 text-red-100 px-4 py-3 rounded-xl mb-6 text-sm flex items-start gap-2 backdrop-blur-sm border border-red-500/30">
                                <Info className="w-5 h-5 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {!initialAmount || !startDate ? (
                            <div className="text-center py-10 opacity-80">
                                <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>Completa los parámetros para ver el resultado.</p>
                            </div>
                        ) : result ? (
                            <div className="space-y-8 relative z-10">
                                <div>
                                    <p className="text-teal-100 font-medium mb-1">Nuevo Monto a Abonar</p>
                                    <p className="text-4xl lg:text-5xl font-bold">{formatCurrency(result.newAmount)}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-teal-500/30">
                                    <div>
                                        <p className="text-teal-100 text-sm mb-1">Incremento Total</p>
                                        <p className="text-2xl font-bold text-teal-50">+{result.increasePercentage.toFixed(2)}%</p>
                                    </div>
                                    <div>
                                        <p className="text-teal-100 text-sm mb-1">Diferencia</p>
                                        <p className="text-2xl font-bold text-teal-50">{formatCurrency(result.newAmount - result.oldAmount)}</p>
                                    </div>
                                </div>

                                <div className="bg-black/20 rounded-xl p-4 text-sm text-teal-50 backdrop-blur-sm">
                                    <div className="flex justify-between items-center opacity-80 mb-2">
                                        <span>Índice Inicial ({result.startKey})</span>
                                        <span className="font-bold">{result.startIdx}</span>
                                    </div>
                                    <div className="flex justify-between items-center opacity-80">
                                        <span>Índice Final ({result.endKey})</span>
                                        <span className="font-bold">{result.endIdx.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>

                    {/* Export Widget */}
                    {result && (
                        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-[var(--text-main)]">Mensaje para Inquilino</h3>
                                <button
                                    onClick={copyToClipboard}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${copied ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-[var(--text-secondary)] hover:bg-gray-100 hover:text-[var(--text-main)]'
                                        }`}
                                >
                                    {copied ? <><Check className="w-4 h-4" /> Copiado</> : <><Copy className="w-4 h-4" /> Copiar</>}
                                </button>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 whitespace-pre-line border border-gray-100 font-mono">
                                {getWhatsappMessage()}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

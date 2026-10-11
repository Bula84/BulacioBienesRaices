import { NextResponse } from 'next/server';

/**
 * Índices oficiales para la calculadora de alquileres.
 *
 * Fuentes:
 *  - ICL  → BCRA, Estadísticas Monetarias v4.0, variable 40
 *           "Índice para Contratos de Locación (base 30.6.20=1)", serie DIARIA
 *  - IPC  → datos.gob.ar, serie 148.3_INIVELNAL_DICI_M_26
 *           "Índice de Precios al Consumidor, nivel general (base dic-2016=100)"
 *
 * Se consulta desde el servidor para evitar CORS y para cachear la respuesta
 * durante 6 horas (los índices se publican con un día de desfase).
 */

export const revalidate = 21600; // 6 horas

const BCRA_ICL = 'https://api.bcra.gob.ar/estadisticas/v4.0/Monetarias/40';
const DATOS_AR_IPC =
    'https://apis.datos.gob.ar/series/api/series/?ids=148.3_INIVELNAL_DICI_M_26&format=json&limit=1000&sort=desc';

interface Fuente {
    ICL: Record<string, number>;
    IPC: Record<string, number>;
    fuentes: { ICL: string; IPC: string };
    updated_at: string;
    disponible: boolean;
}

/** Reduce una serie a un índice por mes: `YYYY-MM` → valor. */
function porMes(filas: [string, number][]): Record<string, number> {
    const out: Record<string, number> = {};
    for (const [fecha, valor] of filas) {
        if (typeof valor !== 'number') continue;
        const key = fecha.slice(0, 7);
        // La serie viene en orden descendente: la primera vez que vemos un mes
        // es su último valor publicado, que es el que corresponde usar.
        if (!(key in out)) out[key] = valor;
    }
    return out;
}

async function obtenerICL(): Promise<Record<string, number>> {
    const desde = '2020-07-01';
    const hasta = new Date().toISOString().slice(0, 10);

    const res = await fetch(
        `${BCRA_ICL}?desde=${desde}&hasta=${hasta}&limit=3000`,
        { headers: { Accept: 'application/json' } }
    );
    if (!res.ok) throw new Error(`BCRA respondió ${res.status}`);

    const data = await res.json();
    const filas: [string, number][] = (data?.results?.[0]?.detalle ?? []).map(
        (d: { fecha: string; valor: number }) => [d.fecha, d.valor]
    );
    if (filas.length === 0) throw new Error('BCRA devolvió una serie vacía');

    return porMes(filas);
}

async function obtenerIPC(): Promise<Record<string, number>> {
    const res = await fetch(DATOS_AR_IPC, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`datos.gob.ar respondió ${res.status}`);

    const data = await res.json();
    const filas: [string, number][] = Array.isArray(data?.data) ? data.data : [];
    if (filas.length === 0) throw new Error('datos.gob.ar devolvió una serie vacía');

    return porMes(filas);
}

export async function GET() {
    const [iclRes, ipcRes] = await Promise.allSettled([obtenerICL(), obtenerIPC()]);

    const ICL = iclRes.status === 'fulfilled' ? iclRes.value : {};
    const IPC = ipcRes.status === 'fulfilled' ? ipcRes.value : {};

    if (iclRes.status === 'rejected') console.error('ICL:', iclRes.reason);
    if (ipcRes.status === 'rejected') console.error('IPC:', ipcRes.reason);

    const payload: Fuente = {
        ICL,
        IPC,
        fuentes: {
            ICL: 'BCRA — Índice para Contratos de Locación (serie 40)',
            IPC: 'datos.gob.ar — IPC nivel general',
        },
        updated_at: new Date().toISOString(),
        disponible: Object.keys(ICL).length > 0 || Object.keys(IPC).length > 0,
    };

    return NextResponse.json(payload, {
        headers: {
            'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=43200',
        },
    });
}

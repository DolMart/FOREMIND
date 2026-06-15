/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Store, ShoppingList, Product } from '../types/types';
import {
  Navigation,
  MapPin,
  Sliders,
  BellRing,
  RefreshCw,
  ShoppingCart,
  HelpCircle,
} from 'lucide-react';

interface MapViewProps {
  stores: Store[];
  lists: ShoppingList[];
  alertRadius: number;
  onSetAlertRadius: (r: number) => void;
  onSimulateGeofenceTrigger: (store: Store, pendingItems: Product[]) => void;
  onLogSimulatation: (msg: string) => void;
}

export default function MapView({
  stores,
  lists,
  alertRadius,
  onSetAlertRadius,
  onSimulateGeofenceTrigger,
  onLogSimulatation,
}: MapViewProps) {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // Filter pending items from all lists
  const pendingProducts = lists.flatMap((l) =>
    l.items.filter((i) => !i.purchased),
  );

  const handleScanPlaces = () => {
    setIsScanning(true);
    onLogSimulatation(
      'Consultando Google Places API para detectar supermercados y farmacias...',
    );
    setTimeout(() => {
      setIsScanning(false);
      onLogSimulatation(
        `Google Places detectó ${stores.length} tiendas dentro de la cuadrícula de simulación.`,
      );
    }, 1000);
  };

  const handleSimulateEntersGeofence = (store: Store) => {
    onLogSimulatation(
      `Gatillando simulación de geocerca: Usuario ingresa al radio de ${store.distance} mi de ${store.name}`,
    );

    // Find matching items
    const relevantPending = pendingProducts.filter((p) =>
      store.availableProducts.some(
        (ap) =>
          ap.productName.toLowerCase().includes(p.name.toLowerCase()) ||
          p.name.toLowerCase().includes(ap.productName.toLowerCase()),
      ),
    );

    onLogSimulatation(
      `Verificando listas activas: Encontrados ${relevantPending.length} productos pendientes para la tienda ${store.name}.`,
    );

    // Call callback to trigger alert popup and push message in Parent App
    onSimulateGeofenceTrigger(store, relevantPending);
  };

  return (
    <div
      id='map-view-container'
      className='h-full w-full bg-slate-950 text-slate-100 flex flex-col p-4 overflow-y-auto'
    >
      {/* Title block */}
      <div className='mb-4'>
        <div className='flex justify-between items-center'>
          <h3 className='text-sm font-bold text-white flex items-center gap-1.5'>
            <Navigation className='w-4 h-4 text-emerald-400 animate-pulse' />
            <span>Geolocalización Inteligente</span>
          </h3>
          <button
            onClick={handleScanPlaces}
            disabled={isScanning}
            className='p-1 px-2.5 bg-slate-900 border border-slate-800 rounded-lg text-[10px] text-emerald-400 font-mono hover:bg-slate-850 flex items-center gap-1 active:scale-98 disabled:opacity-50 cursor-pointer'
          >
            <RefreshCw
              className={`w-3 h-3 ${isScanning ? 'animate-spin' : ''}`}
            />
            <span>RE-ESCANEAR</span>
          </button>
        </div>
        <p className='text-[11px] text-slate-400 mt-1'>
          Simulador de geofencing en segundo plano de FOREMIND. Detecta tiendas
          a menos de 2 millas.
        </p>
      </div>

      {/* Visual Map Radar Screen */}
      <div className='relative aspect-video w-full bg-slate-900 border border-slate-850 rounded-2xl overflow-hidden mb-4 flex items-center justify-center'>
        {/* Circular Grid Rings */}
        <div className='absolute w-[90%] aspect-square border border-dashed border-slate-800 rounded-full animate-pulse opacity-40' />
        <div className='absolute w-[60%] aspect-square border border-slate-800 rounded-full opacity-60' />
        <div className='absolute w-[30%] aspect-square border border-slate-800 rounded-full opacity-80' />

        {/* Radar Line Sweep */}
        <div className='absolute inset-0 bg-gradient-to-tr from-transparent via-emerald-500/5 to-transparent rotate-45 rounded-full origin-center pointer-events-none' />

        {/* Center / User Location */}
        <div className='absolute z-10 flex flex-col items-center'>
          <div className='w-3.5 h-3.5 bg-blue-500 rounded-full ring-4 ring-blue-500/20 flex items-center justify-center animate-ping' />
          <div className='w-3 h-3 bg-blue-500 rounded-full border border-white' />
          <span className='text-[8px] bg-slate-950 py-0.5 px-1.5 rounded border border-slate-800 mt-1 text-blue-400 font-mono font-bold'>
            TÚ (GPS)
          </span>
        </div>

        {/* Map Plot Markers */}
        {stores.map((store) => {
          // Adjust marker coordinate multipliers visually inside container
          const styleX =
            store.id === 'store-1'
              ? '25%'
              : store.id === 'store-2'
                ? '75%'
                : store.id === 'store-3'
                  ? '40%'
                  : '80%';
          const styleY =
            store.id === 'store-1'
              ? '25%'
              : store.id === 'store-2'
                ? '35%'
                : store.id === 'store-3'
                  ? '80%'
                  : '75%';

          const isInRadius = store.distance <= alertRadius;

          return (
            <button
              key={store.id}
              onClick={() => setSelectedStore(store)}
              className='absolute z-10 flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer'
              style={{ left: styleX, top: styleY }}
            >
              <div
                className={`p-1.5 rounded-full transition-all border ${
                  isInRadius
                    ? 'bg-emerald-500 text-slate-950 border-white scale-110 shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-955 text-slate-400 border-slate-800'
                }`}
              >
                <MapPin className='w-3.5 h-3.5' />
              </div>
              <span className='text-[7px] font-bold bg-slate-950/90 py-0.2 px-1 border border-slate-850 rounded mt-0.5 max-w-[65px] truncate text-slate-300'>
                {store.name.split(' ')[0]}
              </span>
            </button>
          );
        })}

        {/* Alert Radius Ring Visualizer */}
        <div
          className='absolute border border-emerald-500/30 bg-emerald-500/5 rounded-full pointer-events-none transition-all duration-300'
          style={{
            width:
              alertRadius === 0.5 ? '35%' : alertRadius === 1.0 ? '65%' : '95%',
            height:
              alertRadius === 0.5 ? '35%' : alertRadius === 1.0 ? '65%' : '95%',
          }}
        />
      </div>

      {/* Configuration Sliders & Radius controllers */}
      <div className='bg-slate-900 border border-slate-850 p-3 rounded-xl mb-4'>
        <div className='flex justify-between items-center mb-2'>
          <span className='text-xs font-bold text-slate-200'>
            Radio de Geofencing Preferido
          </span>
          <span className='text-xs font-mono font-bold text-emerald-400'>
            {alertRadius} Millas
          </span>
        </div>
        <div className='flex gap-2'>
          {[0.5, 1.0, 2.0].map((r) => (
            <button
              key={r}
              onClick={() => {
                onSetAlertRadius(r);
                onLogSimulatation(
                  `Radio de geofencing actualizado a: ${r} mi (~${Math.round(r * 1.62)} km)`,
                );
              }}
              className={`flex-1 py-1 text-xs rounded-lg font-mono transition-all cursor-pointer ${
                alertRadius === r
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              {r} mi
            </button>
          ))}
        </div>
      </div>

      {/* Quick Location action simulator panel */}
      <h4 className='text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-2'>
        Simulador de Movimiento Físico
      </h4>

      <div className='flex flex-col gap-2'>
        {stores.map((store) => {
          const distanceMatches = store.distance <= alertRadius;
          const matchedPending = pendingProducts.filter((p) =>
            store.availableProducts.some(
              (ap) =>
                ap.productName.toLowerCase().includes(p.name.toLowerCase()) ||
                p.name.toLowerCase().includes(ap.productName.toLowerCase()),
            ),
          );

          return (
            <div
              key={store.id}
              className={`p-3 rounded-xl border flex items-center justify-between text-left transition-colors ${
                selectedStore?.id === store.id
                  ? 'bg-slate-900 border-emerald-500/50'
                  : 'bg-slate-900/60 border-slate-850'
              }`}
            >
              <div className='flex-1'>
                <div className='flex items-center gap-1.5'>
                  <span className='text-xs font-bold text-white'>
                    {store.name}
                  </span>
                  <span className='text-[9px] text-slate-400'>
                    ({store.distance} mi)
                  </span>
                </div>
                <div className='flex gap-1.5 items-center mt-1'>
                  <span className='text-[8px] uppercase bg-slate-950 text-slate-400 px-1.5 py-0.2 rounded font-mono border border-slate-850'>
                    {store.type}
                  </span>
                  <span className='text-[9px] text-emerald-400 font-medium'>
                    {matchedPending.length} productos pendientes
                  </span>
                </div>
              </div>

              <div className='flex gap-1'>
                <button
                  onClick={() => handleSimulateEntersGeofence(store)}
                  className={`p-1.5 rounded-lg text-[10px] font-bold font-mono transition-all flex items-center gap-1 active:scale-95 cursor-pointer ${
                    distanceMatches
                      ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                  disabled={!distanceMatches}
                  title={
                    !distanceMatches
                      ? 'Fuera del rango de alarma configurado'
                      : 'Simular geofencing'
                  }
                >
                  <BellRing className='w-3 h-3' />
                  <span>SIMULAR</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

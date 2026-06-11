/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { codeTemplates } from "../data/mockTemplates";
import { Copy, Terminal, Code, BookOpen, Check, FileText, CheckSquare, Sparkles } from "lucide-react";

interface LogMessage {
  id: string;
  timestamp: string;
  text: string;
  component: string;
}

interface DeveloperConsoleProps {
  logs: LogMessage[];
  codeTarget: string; // iOS or Android selection indicator
  onClearLogs: () => void;
}

export default function DeveloperConsole({ logs, codeTarget, onClearLogs }: DeveloperConsoleProps) {
  const [activeTab, setActiveTab] = useState<"logs" | "code" | "deploy" | "privacy">("logs");
  const [activeCodeFile, setActiveCodeFile] = useState<"rn" | "fastapi" | "firebase">("rn");
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});

  const handleCopyCode = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopiedStates((prev) => ({ ...prev, [key]: false }));
    }, 2000);
  };

  const getActiveCodeText = () => {
    if (activeCodeFile === "rn") return codeTemplates.reactNativeApp;
    if (activeCodeFile === "fastapi") return codeTemplates.fastApiBackend;
    return codeTemplates.firebaseRules;
  };

  return (
    <div
      id="dev-console-container"
      className="h-full w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl"
    >
      {/* Console Top Header Accent */}
      <div className="bg-slate-950 p-4 border-b border-slate-850 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-emerald-400" />
          <div>
            <h2 className="text-sm font-sans font-black text-white uppercase tracking-wider">
              Consola de Integración & Despliegue
            </h2>
            <span className="text-[10px] text-slate-500 font-mono">
              Entorno: Producción Multiplataforma • Vista Activa: {codeTarget}
            </span>
          </div>
        </div>
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping absolute" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 relative" />
        </div>
      </div>

      {/* Tabs navigation list */}
      <div className="flex bg-slate-900/80 border-b border-slate-850 text-xs">
        <button
          onClick={() => setActiveTab("logs")}
          className={`flex-1 py-3 px-4 font-bold border-b-2 flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "logs"
              ? "border-emerald-500 text-emerald-400 bg-slate-950/20"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Bitácora de Eventos</span>
        </button>

        <button
          onClick={() => setActiveTab("code")}
          className={`flex-1 py-3 px-4 font-bold border-b-2 flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "code"
              ? "border-emerald-500 text-emerald-400 bg-slate-950/20"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>Código Fuente Completo</span>
        </button>

        <button
          onClick={() => setActiveTab("deploy")}
          className={`flex-1 py-3 px-4 font-bold border-b-2 flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "deploy"
              ? "border-emerald-500 text-emerald-400 bg-slate-950/20"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Guía de Tiendas</span>
        </button>

        <button
          onClick={() => setActiveTab("privacy")}
          className={`flex-1 py-3 px-4 font-bold border-b-2 flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "privacy"
              ? "border-emerald-500 text-emerald-400 bg-slate-950/20"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Políticas</span>
        </button>
      </div>

      {/* Tab content viewer */}
      <div className="flex-1 p-5 overflow-y-auto text-slate-300">
        
        {/* TAB 1: EVENT LOG FEED */}
        {activeTab === "logs" && (
          <div className="h-full flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">
                  Logs de Escaneo, Scraper & Firebase Sincronizaciones
                </span>
                <button
                  onClick={onClearLogs}
                  className="text-xs text-slate-400 hover:text-red-400 font-bold transition-all underline cursor-pointer"
                >
                  Limpiar historial
                </button>
              </div>

              <div className="flex flex-col gap-2 font-mono text-xs">
                {logs.length === 0 ? (
                  <p className="text-slate-500 italic py-8 text-center">
                    No hay eventos registrados de momento. Interactúa con el simulador del móvil para gatillar geocercas, invitar colaboradores o modificar listas.
                  </p>
                ) : (
                  logs.map((log) => (
                    <div
                      key={log.id}
                      className="p-2.5 bg-slate-950 border border-slate-850 rounded-lg flex flex-col gap-1 text-slate-300 animate-slideUp border-l-2 border-l-emerald-500"
                    >
                      <div className="flex justify-between text-[10px] text-slate-500">
                        <span className="font-bold text-emerald-500 uppercase">
                          [{log.component}]
                        </span>
                        <span>{log.timestamp}</span>
                      </div>
                      <p className="text-xs font-medium text-slate-250 leading-relaxed">
                        {log.text}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-6 p-4 bg-slate-950 border border-slate-850 rounded-2xl">
              <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold block mb-1">
                ¿Cómo probar el Geofencing en este simulador?
              </span>
              <ol className="text-xs text-slate-400 list-decimal pl-4 flex flex-col gap-1.5 leading-normal">
                <li>Ve a la pestaña <b>"Mapa GPS"</b> en el menú inferior del móvil.</li>
                <li>Selecciona o configura tu radio (ej: <b>2 millas</b>).</li>
                <li>Presiona el botón verde de <b>"SIMULAR"</b> en cualquiera de las tiendas enlistadas.</li>
                <li>Esto simulará que el teléfono cruza la geocerca. Recibirás un <b>banner push del sistema</b> y una <b>alerta in-app</b> vinculante para marcar el producto comprado.</li>
              </ol>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTION SOURCE CODE DOWNLOADS */}
        {activeTab === "code" && (
          <div className="flex flex-col h-full">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block mb-3">
              Copia del Código Fuente Listado del Core de FOREMIND
            </span>

            {/* Sub file navigation tabs */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setActiveCodeFile("rn")}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold font-mono cursor-pointer ${
                  activeCodeFile === "rn"
                    ? "bg-slate-950 text-emerald-400 border border-slate-800"
                    : "bg-slate-950/40 text-slate-500 border border-transparent"
                }`}
              >
                App.tsx (React Native)
              </button>
              <button
                onClick={() => setActiveCodeFile("fastapi")}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold font-mono cursor-pointer ${
                  activeCodeFile === "fastapi"
                    ? "bg-slate-950 text-emerald-400 border border-slate-800"
                    : "bg-slate-950/40 text-slate-500 border border-transparent"
                }`}
              >
                main.py (FastAPI Backend)
              </button>
              <button
                onClick={() => setActiveCodeFile("firebase")}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold font-mono cursor-pointer ${
                  activeCodeFile === "firebase"
                    ? "bg-slate-950 text-emerald-400 border border-slate-800"
                    : "bg-slate-950/40 text-slate-500 border border-transparent"
                }`}
              >
                firestore.rules
              </button>
            </div>

            {/* Code Mirror Viewer */}
            <div className="relative flex-1 bg-slate-950 border border-slate-850 rounded-2xl overflow-hidden flex flex-col justify-start">
              <div className="bg-slate-950 px-4 py-2 flex justify-between items-center text-[10px] font-mono text-slate-500 border-b border-slate-900/80">
                <span>
                  {activeCodeFile === "rn"
                    ? "App.tsx (React Native + Expo Location)"
                    : activeCodeFile === "fastapi"
                    ? "main.py (Python FastAPI + Haversine Engine)"
                    : "firestore.rules (Security Sincronización)"}
                </span>

                <button
                  onClick={() => handleCopyCode(getActiveCodeText(), activeCodeFile)}
                  className="flex items-center gap-1 hover:text-emerald-400 text-slate-400 transition-colors font-bold cursor-pointer"
                >
                  {copiedStates[activeCodeFile] ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar código</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 overflow-auto font-mono text-[11px] leading-relaxed text-slate-350 flex-1 max-h-[350px] scrollbar-thin">
                <code>{getActiveCodeText()}</code>
              </pre>
            </div>
          </div>
        )}

        {/* TAB 3: APP STORES PUBLISHING DIRECTIVES & GUIDES */}
        {activeTab === "deploy" && (
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-sans font-black text-white uppercase tracking-wider mb-2">
                Guía de Publicación e Inicio de Tiendas
              </h3>
              <p className="text-xs text-slate-400 leading-normal">
                FOREMIND utiliza sensores de geofencing en segundo plano, lo cual exige justificaciones estrictas para pasar las directrices de Apple App Store y Google Play Store.
              </p>
            </div>

            {/* Android specs checklist */}
            <div className="p-4 bg-slate-950 border border-slate-855 rounded-2xl">
              <div className="flex items-center gap-2 text-white font-bold text-xs mb-3 border-b border-slate-900 pb-2">
                <span className="p-1 px-2.5 bg-emerald-500 text-slate-950 font-bold rounded-lg font-sans">
                  Google Play Store
                </span>
                <span>Directiva Android — Background Geofence</span>
              </div>

              <ul className="text-xs text-slate-400 flex flex-col gap-2 list-none">
                <li className="flex gap-2">
                  <CheckSquare className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-300 block">Permiso ACCESS_BACKGROUND_LOCATION:</span>
                    <span className="text-[11px] block mt-0.5">
                      Debes pedir explícitamente la aprobación al usuario en primer plano, y luego enviarlo a los ajustes del sistema.
                    </span>
                  </div>
                </li>
                <li className="flex gap-2 mt-1">
                  <CheckSquare className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-300 block">Formulario de Declaración de Ubicación:</span>
                    <span className="text-[11px] block mt-0.5 italic text-slate-450 bg-slate-900 p-2 rounded border border-slate-800">
                      "FOREMIND detecta supermercados a menos de 2 millas del usuario para verificar productos pendientes de su lista colaborativa. Este monitoreo requiere 'Ubicación en Segundo Plano' para alertar al usuario mediante FCM sin forzarlo a tener el celular encendido mientras conduce."
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            {/* iOS specs checklist */}
            <div className="p-4 bg-slate-950 border border-slate-855 rounded-2xl">
              <div className="flex items-center gap-2 text-white font-bold text-xs mb-3 border-b border-slate-900 pb-2">
                <span className="p-1 px-2.5 bg-blue-500 text-white font-bold rounded-lg font-sans">
                  Apple App Store
                </span>
                <span>Configuración de iOS — Info.plist Specs</span>
              </div>

              <p className="text-[11px] text-slate-500 font-mono mb-2">
                Debes agregar las siguientes llaves de descripción en tu archivo `Info.plist`:
              </p>

              <pre className="p-3.5 bg-slate-900 border border-slate-850 rounded-xl text-[10px] font-mono text-slate-400 leading-normal overflow-x-auto">
{`<!-- Info.plist FOREMIND Core Description -->
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>FOREMIND necesita acceder a tu ubicación todo el tiempo para detectar tiendas con listas de compra activas dentro de un radio de 2 millas y enviarte cotizaciones de precios en tiempo real de Walmart o Target.</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>FOREMIND necesita acceso a tu ubicación cuando está abierta para mostrar la lista de supermercados locales cercanos.</string>
<key>UIBackgroundModes</key>
<array>
  <string>location</string>
  <string>remote-notification</string>
</array>`}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 4: LEGAL PRIVACY POLICY GENERATED */}
        {activeTab === "privacy" && (
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center border-b border-slate-950 pb-2">
              <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded px-2.5 py-0.5 font-mono font-bold">
                MÓDULO DE TRANSPARENCIA LEGAL
              </span>
              <button
                onClick={() => handleCopyCode(codeTemplates.privacyPolicy, "privacy")}
                className="text-xs text-emerald-400 hover:underline font-mono"
              >
                {copiedStates["privacy"] ? "¡Copiado!" : "Copiar Política"}
              </button>
            </div>

            <div className="p-4 bg-slate-955 rounded-2xl border border-slate-850 text-slate-400 flex flex-col gap-2.5 text-xs">
              <h4 className="font-bold text-slate-200">Política de Privacidad Obligatoria para Google & Apple</h4>
              <p className="text-[11px] leading-relaxed text-slate-350">
                Debido al rastreo en segundo plano, los revisores de Apple y Google comprueban que el sitio web de soporte cuente con una política de privacidad explícita.
              </p>
              <div className="p-3 bg-slate-950 border border-slate-900 rounded-xl max-h-[220px] overflow-y-auto font-mono text-[10px] leading-normal text-slate-500">
                {codeTemplates.privacyPolicy}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

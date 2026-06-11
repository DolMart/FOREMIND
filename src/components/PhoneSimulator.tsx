/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { ShoppingList, Product, Store, ListMember, UserProfile, ChangeLog, Category } from "../types";
import { defaultLists, defaultStores, initialProfile, defaultLogs } from "../data/mockTemplates";
import { 
  Smartphone, Eye, Layers, Bell, CheckCircle, Flame, 
  MapPin, Settings, Info, ShoppingBag, Radio, ShieldCheck 
} from "lucide-react";

// Views
import SplashView from "./SplashView";
import LoginView from "./LoginView";
import ListsView from "./ListsView";
import ListDetailView from "./ListDetailView";
import MapView from "./MapView";
import MembersView from "./MembersView";
import SettingsView from "./SettingsView";
import AboutView from "./AboutView";

interface PhoneSimulatorProps {
  onAddLog: (action: string, component: string) => void;
  onSetCodeTarget: (target: string) => void;
}

export default function PhoneSimulator({ onAddLog, onSetCodeTarget }: PhoneSimulatorProps) {
  // Device mode
  const [deviceShell, setDeviceShell] = useState<"ios" | "android">("ios");
  
  // App navigation state
  const [currentScreen, setCurrentScreen] = useState<
    "splash" | "login" | "lists" | "detail" | "map" | "members" | "settings" | "about"
  >("splash");

  // Global Lists and Profile State (stored in localStorage)
  const [lists, setLists] = useState<ShoppingList[]>(() => {
    const saved = localStorage.getItem("foremind_shopping_lists");
    return saved ? JSON.parse(saved) : defaultLists;
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("foremind_user_profile");
    return saved ? JSON.parse(saved) : initialProfile;
  });

  const [selectedListId, setSelectedListId] = useState<string | null>("list-1");
  const [alertRadius, setAlertRadius] = useState<number>(profile.alertRadius);

  // Active push notification banner queue
  const [activeNotification, setActiveNotification] = useState<{
    title: string;
    body: string;
    storeId: string;
  } | null>(null);

  // Active Interactive Map Purchase Prompt
  const [activePurchasePrompt, setActivePurchasePrompt] = useState<{
    productName: string;
    storeName: string;
    price: number;
    distance: number;
    productId: string;
    listId: string;
  } | null>(null);

  // Keep alert radius in sync
  useEffect(() => {
    setAlertRadius(profile.alertRadius);
  }, [profile.alertRadius]);

  // Save state helper
  const saveLists = (updatedLists: ShoppingList[]) => {
    setLists(updatedLists);
    localStorage.setItem("foremind_shopping_lists", JSON.stringify(updatedLists));
  };

  const saveProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    localStorage.setItem("foremind_user_profile", JSON.stringify(updatedProfile));
  };

  // Log simulation wrapper
  const triggerSysLog = (msg: string) => {
    onAddLog(msg, "FOREMIND-Applet");
  };

  // Select list view handler
  const handleSelectList = (listId: string) => {
    setSelectedListId(listId);
    setCurrentScreen("detail");
    triggerSysLog(`Abriendo lista: '${lists.find((l) => l.id === listId)?.name}'`);
  };

  // Add shopping products
  const handleAddItem = (newItem: Omit<Product, "id" | "purchased">) => {
    if (!selectedListId) return;
    const updated = lists.map((l) => {
      if (l.id === selectedListId) {
        const itemObj: Product = {
          ...newItem,
          id: `prod-${Date.now()}`,
          purchased: false,
        };
        // Simulated scraped real-time fallback price scraping info
        const storeMatch = defaultStores[0]; // Auto Walmart or Kroger demo matches
        const storeProd = storeMatch.availableProducts.find(
          (ap) => ap.productName.toLowerCase().includes(newItem.name.toLowerCase()) || 
                  newItem.name.toLowerCase().includes(ap.productName.toLowerCase())
        );
        if (storeProd) {
          itemObj.scrapedPrice = storeProd.price;
          itemObj.scrapedStore = storeMatch.name;
        }

        return { ...l, items: [...l.items, itemObj] };
      }
      return l;
    });

    saveLists(updated);
    triggerSysLog(`Sincronizado con Firestore: Creado producto '${newItem.name}'`);
  };

  // Update item
  const handleUpdateItem = (itemId: string, updatedFields: Partial<Product>) => {
    if (!selectedListId) return;
    const updated = lists.map((l) => {
      if (l.id === selectedListId) {
        return {
          ...l,
          items: l.items.map((i) => (i.id === itemId ? { ...i, ...updatedFields } : i)),
        };
      }
      return l;
    });
    saveLists(updated);

    const targetItemName = lists
      .find((l) => l.id === selectedListId)
      ?.items.find((i) => i.id === itemId)?.name || "";

    if (updatedFields.purchased !== undefined) {
      triggerSysLog(
        `Firebase Realtime: ${profile.name} marcó '${targetItemName}' como ${
          updatedFields.purchased ? "COMPRADO" : "PENDIENTE"
        }`
      );
    } else {
      triggerSysLog(`Usuario modificó '${targetItemName}'`);
    }
  };

  // Delete product
  const handleDeleteItem = (itemId: string) => {
    if (!selectedListId) return;
    const targetItemName = lists
      .find((l) => l.id === selectedListId)
      ?.items.find((i) => i.id === itemId)?.name || "";

    const updated = lists.map((l) => {
      if (l.id === selectedListId) {
        return {
          ...l,
          items: l.items.filter((i) => i.id !== itemId),
        };
      }
      return l;
    });
    saveLists(updated);
    triggerSysLog(`Firestore delete: Eliminado '${targetItemName}'`);
  };

  // Create list
  const handleAddList = (name: string, category: string) => {
    const newListObj: ShoppingList = {
      id: `list-${Date.now()}`,
      name,
      category,
      items: [],
      members: [
        { email: profile.email, name: profile.name, role: "admin" }
      ]
    };
    saveLists([...lists, newListObj]);
    triggerSysLog(`Creado contenedor Firestore: Nueva lista '${name}' [${category}]`);
  };

  // Invite member
  const handleInviteMember = (email: string, name: string, role: ListMember["role"]) => {
    if (!selectedListId) return;
    const updated = lists.map((l) => {
      if (l.id === selectedListId) {
        // Guard against duplicates
        if (l.members.some((m) => m.email === email)) return l;
        return { ...l, members: [...l.members, { email, name, role }] };
      }
      return l;
    });
    saveLists(updated);
    triggerSysLog(`Invitación en tiempo real: Se unió '${name}' (${email}) con rango '${role}'`);
  };

  // Remove member
  const handleRemoveMember = (email: string) => {
    if (!selectedListId) return;
    const updated = lists.map((l) => {
      if (l.id === selectedListId) {
        return { ...l, members: l.members.filter((m) => m.email !== email) };
      }
      return l;
    });
    saveLists(updated);
    triggerSysLog(`Eliminado colaborador de lista colaborativa: ${email}`);
  };

  // Trigger simulated Geofencing
  const handleGeofencePushAndPrompt = (store: Store, matchedPending: Product[]) => {
    if (matchedPending.length === 0) {
      triggerSysLog(`Detección de radio de ${store.name} aprobada, pero no tienes ningún producto de esta tienda pendiente.`);
      alert(`Estás cerca de ${store.name}, pero de momento no tienes pendientes de tu lista para este supermercado.`);
      return;
    }

    const itemsStr = matchedPending.map((p) => p.name).join(", ");
    const title = `¡${store.name} a ${store.distance} mi!`;
    const body = `Tienes pendiente: ${itemsStr}`;

    // 1. Send simulated FCM Native Push banner
    setActiveNotification({
      title,
      body,
      storeId: store.id,
    });

    // 2. Spawn Interactive Purchase Alert Card
    const targetItem = matchedPending[0];
    const itemPrice = store.availableProducts.find((ap) =>
      ap.productName.toLowerCase().includes(targetItem.name.toLowerCase()) || 
      targetItem.name.toLowerCase().includes(ap.productName.toLowerCase())
    )?.price || targetItem.estimatedPrice;

    // Find custom list ID for targetItem
    const matchedList = lists.find((l) => l.items.some((i) => i.id === targetItem.id));

    if (matchedList) {
      setActivePurchasePrompt({
        productName: targetItem.name,
        storeName: store.name,
        price: itemPrice,
        distance: store.distance,
        productId: targetItem.id,
        listId: matchedList.id,
      });
    }

    triggerSysLog(`FCM Cloud Messaging: Enviado Push payload para geocerca comercial de '${store.name}'`);
  };

  // Confirm simulated in-app purchases
  const handleAcceptPurchasePrompt = () => {
    if (!activePurchasePrompt) return;
    const { listId, productId, productName, storeName } = activePurchasePrompt;

    // Update product item as purchased
    const updated = lists.map((l) => {
      if (l.id === listId) {
        return {
          ...l,
          items: l.items.map((i) => (i.id === productId ? { ...i, purchased: true } : i)),
        };
      }
      return l;
    });

    saveLists(updated);
    triggerSysLog(`Compra confirmada. Sincronizado en Firestore: '${productName}' comprado en '${storeName}'.`);
    
    setActivePurchasePrompt(null);
    alert(`¡Listo! Se marcó como comprado en la lista '${lists.find((l) => l.id === listId)?.name}'.`);
  };

  // Current selected list for lists subviews
  const currentSelectedList = lists.find((l) => l.id === selectedListId) || lists[0];

  return (
    <div className="flex flex-col items-center justify-center p-2 w-full max-w-sm mx-auto">
      {/* Shell Selector */}
      <div id="device-shell-selector" className="flex items-center gap-2 mb-4 bg-slate-900/60 p-1 rounded-full border border-slate-800">
        <button
          onClick={() => {
            setDeviceShell("ios");
            onSetCodeTarget("iOS");
          }}
          className={`px-3 py-1 text-xs rounded-full cursor-pointer transition-all ${
            deviceShell === "ios" ? "bg-emerald-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          iOS Frame (iPhone 16)
        </button>
        <button
          onClick={() => {
            setDeviceShell("android");
            onSetCodeTarget("Android");
          }}
          className={`px-3 py-1 text-xs rounded-full cursor-pointer transition-all ${
            deviceShell === "android" ? "bg-emerald-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Android Frame (Pixel 9)
        </button>
      </div>

      {/* Main mockup container */}
      <div
        id="phone-frame-body"
        className={`relative w-[340px] h-[670px] bg-slate-950 rounded-[44px] shadow-2xl overflow-hidden border-slate-800 transition-all duration-300 transform flex flex-col justify-between ${
          deviceShell === "ios"
            ? "border-[9px] shadow-[0_25px_50px_-12px_rgba(16,185,129,0.1)]"
            : "border-[12px] border-slate-900 rounded-[48px]"
        }`}
      >
        {/* TOP STATUS BAR SHAPE */}
        {deviceShell === "ios" ? (
          /* iOS Dynamic Island */
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-2xl z-50 flex items-center justify-center px-1">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-1" />
            <span className="text-[8px] text-emerald-400 font-mono font-bold tracking-tighter">FOREMIND GPS</span>
          </div>
        ) : (
          /* Android Punch Hole Camera */
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4.5 h-4.5 bg-slate-950 border border-slate-900 rounded-full z-50 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-emerald-500/85 rounded-full" />
          </div>
        )}

        {/* SYSTEM STATUS BAR AND CARRIER */}
        <div id="system-status-bar" className="h-7 w-full bg-slate-950 flex justify-between items-center px-6 pt-1 text-[10px] text-slate-400 font-sans tracking-wide z-40 select-none">
          <span>08:08 AM</span>
          <div className="flex items-center gap-1">
            <span className="text-[8px] font-mono font-black uppercase text-emerald-500 tracking-tighter">5G LTE</span>
            <div className="w-4.5 h-2.5 border border-slate-500 rounded px-0.5 py-0.2 flex items-center">
              <div className="w-full h-full bg-emerald-400 rounded-2xs" />
            </div>
          </div>
        </div>

        {/* NOTIFICATION SLIDE-DOWN FCM BANNER (GEOLOCATION ALERTS) */}
        {activeNotification && (
          <div
            onClick={() => setActiveNotification(null)}
            className="absolute top-8 left-3.5 right-3.5 bg-slate-900/95 border border-emerald-500/40 rounded-2xl p-3 shadow-2xl z-50 animate-slideIn flex items-start gap-2.5 cursor-pointer hover:bg-slate-850"
          >
            <div className="p-2 bg-emerald-500 text-slate-950 rounded-xl flex-shrink-0 animate-bounce">
              <Bell className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="flex-1 text-left">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                  FOREMIND ALERTA
                </span>
                <span className="text-[8px] text-slate-500">Ahora</span>
              </div>
              <h5 className="text-[11px] font-black text-white mt-0.5 leading-tight">{activeNotification.title}</h5>
              <p className="text-[10px] text-slate-300 leading-snug mt-0.5">{activeNotification.body}</p>
            </div>
          </div>
        )}

        {/* SCREEN CANVAS AREA */}
        <div id="app-viewport-canvas" className="flex-1 w-full bg-slate-950 overflow-hidden relative flex flex-col pt-0 pb-1.5">
          {/* Main Router state visualizer */}
          {currentScreen === "splash" && (
            <SplashView onDismiss={() => {
              setCurrentScreen("login");
              triggerSysLog("Splash screen de FOREMIND completada. Solicitando credenciales...");
            }} />
          )}

          {currentScreen === "login" && (
            <LoginView
              onLoginSuccess={(email, name) => {
                saveProfile({ ...profile, email, name });
                setCurrentScreen("lists");
                triggerSysLog(`Sesión de Firebase iniciada: Autenticado como ${name} (${email})`);
              }}
            />
          )}

          {currentScreen === "lists" && (
            <ListsView
              lists={lists}
              onSelectList={handleSelectList}
              onAddList={handleAddList}
            />
          )}

          {currentScreen === "detail" && currentSelectedList && (
            <ListDetailView
              list={currentSelectedList}
              onBack={() => {
                setCurrentScreen("lists");
                triggerSysLog("Volviendo al inicio de mis listas de compras.");
              }}
              onManageMembers={() => {
                setCurrentScreen("members");
                triggerSysLog("Navegando a administración de cooperadores.");
              }}
              onAddItem={handleAddItem}
              onUpdateItem={handleUpdateItem}
              onDeleteItem={handleDeleteItem}
            />
          )}

          {currentScreen === "map" && (
            <MapView
              stores={defaultStores}
              lists={lists}
              alertRadius={alertRadius}
              onSetAlertRadius={(radius) => {
                saveProfile({ ...profile, alertRadius: radius });
              }}
              onSimulateGeofenceTrigger={handleGeofencePushAndPrompt}
              onLogSimulatation={triggerSysLog}
            />
          )}

          {currentScreen === "members" && currentSelectedList && (
            <MembersView
              list={currentSelectedList}
              onBack={() => {
                setCurrentScreen("detail");
                triggerSysLog("Volviendo al editor de lista.");
              }}
              onInviteMember={handleInviteMember}
              onRemoveMember={handleRemoveMember}
            />
          )}

          {currentScreen === "settings" && (
            <SettingsView
              profile={profile}
              onChangeProfile={(updated) => saveProfile({ ...profile, ...updated })}
              onLogSimulatation={triggerSysLog}
            />
          )}

          {currentScreen === "about" && <AboutView />}

          {/* INTERACTIVE ALERTS POPUP PROMPT PANEL OVERLAY */}
          {activePurchasePrompt && (
            <div id="alert-overlay-bg" className="absolute inset-0 bg-black/75 flex items-center justify-center p-4 z-40 animate-fadeIn">
              <div
                id="alert-box"
                className="bg-slate-900 border border-emerald-500/30 p-4 rounded-3xl w-full max-w-[280px] text-center shadow-2xl flex flex-col gap-3.5 align-middle select-none scale-100 transition-transform"
              >
                <div className="mx-auto p-3 bg-emerald-500/10 text-emerald-400 rounded-full w-fit">
                  <ShoppingBag className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-mono font-bold text-slate-500 tracking-wider">
                    GEOFENCE INTERACTIVA
                  </span>
                  <h4 className="text-xs font-bold text-white mt-1 leading-normal">
                    ¿Deseas comprar {activePurchasePrompt.productName} en{" "}
                    {activePurchasePrompt.storeName} a ${activePurchasePrompt.price}?
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                    Detectado a {activePurchasePrompt.distance} millas de tu ubicación física.
                  </p>
                </div>

                <div className="flex gap-2 text-xs">
                  <button
                    onClick={() => setActivePurchasePrompt(null)}
                    className="flex-1 py-2 border border-slate-800 rounded-xl text-slate-400 font-bold hover:bg-slate-850 transition-colors cursor-pointer text-[11px]"
                  >
                    Ignorar
                  </button>
                  <button
                    onClick={handleAcceptPurchasePrompt}
                    className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-colors cursor-pointer text-[11px]"
                  >
                    Marcar Comprado
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM MOBILE OS HOME NAV BAR INDICATIONS */}
        {currentScreen !== "splash" && currentScreen !== "login" ? (
          <div id="phone-bottom-tabs" className="h-[52px] bg-slate-950 border-t border-slate-900/80 w-full flex items-center justify-around text-slate-500 z-40 select-none pb-0.5">
            <button
              onClick={() => {
                setCurrentScreen("lists");
                triggerSysLog("Navegando a Pantalla de Mis Listas.");
              }}
              className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors ${
                currentScreen === "lists" || currentScreen === "detail" || currentScreen === "members"
                  ? "text-emerald-400 font-bold"
                  : "hover:text-slate-300"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-[8px] uppercase tracking-wide font-medium">Listas</span>
            </button>

            <button
              id="map-tab-btn"
              onClick={() => {
                setCurrentScreen("map");
                triggerSysLog("Navegando a Mapa de geolocalización.");
              }}
              className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors ${
                currentScreen === "map" ? "text-emerald-400 font-bold" : "hover:text-slate-300"
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span className="text-[8px] uppercase tracking-wide font-medium">Mapa GPS</span>
            </button>

            <button
              onClick={() => {
                setCurrentScreen("settings");
                triggerSysLog("Abriendo ajustes de alertas y FCM push.");
              }}
              className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors ${
                currentScreen === "settings" ? "text-emerald-400 font-bold" : "hover:text-slate-300"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span className="text-[8px] uppercase tracking-wide font-medium">Ajustes</span>
            </button>

            <button
              onClick={() => {
                setCurrentScreen("about");
                triggerSysLog("Mostrando pestaña Acerca de FOREMIND.");
              }}
              className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors ${
                currentScreen === "about" ? "text-emerald-400 font-bold" : "hover:text-slate-300"
              }`}
            >
              <Info className="w-4 h-4" />
              <span className="text-[8px] uppercase tracking-wide font-medium">Acerca de</span>
            </button>
          </div>
        ) : (
          /* Bottom bar space if empty */
          <div className="h-4 bg-slate-950 w-full flex items-center justify-center p-1 select-none">
            <div className="w-24 h-1 bg-slate-800 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
}


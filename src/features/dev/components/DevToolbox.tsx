"use client";

import { Bug, X, Terminal, Cpu, Layers, ShieldCheck, Database, Users, Wifi, WifiOff, ToggleRight, Fingerprint, MapPin } from "lucide-react";
import { useEffect, useRef, useState, Fragment } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/auth/context/AuthContext";
import { useGetColony } from "@/features/management/colony/hooks/useGetColony";
import { useDev } from "../context/DevContext";
import { useDraggableAccessibility } from "@/features/accessibility/hooks/useDraggableAccessibility";
import { getButtonStyle, getPanelStyle } from "./DevToolbox.styles";
import { UserApi, UserData, UserRole, CODE_TO_ROLE } from "@/types/user.types";
import { useRouter, usePathname } from "next/navigation";
import { Compass, Home, LayoutGrid } from "lucide-react";

const ROLES: {
  role: UserRole | undefined;
  label: string;
  color: string;
  neon: string;
}[] = [
  {
    role: undefined,
    label: "GUEST",
    color: "bg-zinc-800",
    neon: "border-zinc-500 shadow-[0_0_10px_rgba(113,113,122,0.5)]",
  },
  { 
    role: "usuario", 
    label: "USER", 
    color: "bg-emerald-950", 
    neon: "border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
  },
  {
    role: "lider_colonia",
    label: "LEAD",
    color: "bg-cyan-950",
    neon: "border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]",
  },
  { 
    role: "admin", 
    label: "ADMIN", 
    color: "bg-rose-950", 
    neon: "border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" 
  },
];

export default function DevToolboxWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <DevToolbox />;
}

function DevToolbox() {
  const { user, effectiveRole, login, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { getColony, colony: fetchedColony, loading: loadingColony } = useGetColony();
  const { 
    roleOverride, 
    setRoleOverride, 
    mockUserId, 
    setMockUserId, 
    mockColoniaId, 
    setMockColoniaId,
    apiMode,
    setApiMode,
    featureFlags,
    setFeatureFlag,
    isDev 
  } = useDev();

  const [isOpen, setIsOpen] = useState(false);
  const [buttonPosition, setButtonPosition] = useState<"top-left" | "top-right" | "bottom-left" | "bottom-right">("top-left");
  const [activeTab, setActiveTab] = useState<"users" | "features" | "routes">("users");
  
  const [realUsers, setRealUsers] = useState<UserData[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const togglePanel = () => setIsOpen((prev) => !prev);
  
  const { ref, pos, corner, hasMoved, isDragging, isReady } =
    useDraggableAccessibility(setButtonPosition, buttonPosition);
    
  const wasOpenRef = useRef(false);
  const prevDraggingRef = useRef(false);

  useEffect(() => {
    if (isDragging && !prevDraggingRef.current) {
      wasOpenRef.current = isOpen;
      if (isOpen) {
        setIsOpen(false);
      }
    } else if (!isDragging && prevDraggingRef.current && wasOpenRef.current) {
      setIsOpen(true);
    }
    prevDraggingRef.current = isDragging;
  }, [isDragging, isOpen]);

  useEffect(() => {
    if (apiMode && realUsers.length === 0) {
      setIsLoadingUsers(true);
      const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "";
      fetch(`${baseURL}/api/v1/usuario/todos`)
        .then(res => res.json())
        .then((data: UserApi[]) => {
          const mapped = data.map(u => {
            const { codigo_rol, ...rest } = u;
            return { ...rest, role: CODE_TO_ROLE[codigo_rol] } as UserData;
          });
          setRealUsers(mapped);
        })
        .catch(console.error)
        .finally(() => setIsLoadingUsers(false));
    }
  }, [apiMode, realUsers.length]);

  useEffect(() => {
    if (user?.codigo_colonia && apiMode) {
      getColony(user.codigo_colonia);
    }
  }, [user?.codigo_colonia, getColony, apiMode]);

  const handleButtonClick = () => {
    if (!hasMoved.current) {
      togglePanel();
    }
  };

  const showColoniaPicker =
    effectiveRole === "usuario" || effectiveRole === "lider_colonia";

  const filteredUsers = realUsers.filter(u => 
    `${u.nombre} ${u.apellido} ${u.documento}`.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  const shouldShow = isDev || process.env.NODE_ENV === "development";
  if (!shouldShow) return null;

  return (
    <>
      <style>{`
        .dev-dropdown-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .dev-dropdown-scrollbar::-webkit-scrollbar-track {
          background: rgba(24, 24, 27, 0.5); /* zinc-900/50 */
        }
        .dev-dropdown-scrollbar::-webkit-scrollbar-thumb {
          background: #84cc16; /* lime-500 */
          border-radius: 9999px;
        }
      `}</style>

      <div
        ref={ref}
        style={{ 
          ...getButtonStyle(pos, isDragging), 
          visibility: isReady ? "visible" : "hidden",
        }}
        className="group"
      >
        <button
          onClick={handleButtonClick}
          className={`w-14 h-14 rounded-2xl border-2 transition-all duration-300 flex items-center justify-center overflow-hidden relative shadow-2xl ${
            isOpen 
              ? "bg-zinc-900 border-lime-500 rotate-90" 
              : "bg-black border-zinc-700 hover:border-lime-500 hover:scale-110"
          }`}
          aria-label="Toggle Dev Console"
        >
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#4ade80_1px,transparent_1px)] [background-size:10px_10px]" />
          
          <Bug 
            size={28} 
            className={`transition-colors duration-300 ${isOpen ? "text-lime-500" : "text-zinc-500 group-hover:text-lime-400"}`} 
          />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.section
            style={getPanelStyle(pos, corner)}
            className="w-80 backdrop-blur-xl bg-black/90 border border-zinc-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto z-[9999] font-mono text-zinc-400"
            initial={{ opacity: 0, scale: 0.9, y: -20, rotateX: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20, rotateX: -10 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <div className="bg-zinc-900/50 px-4 py-3 border-b border-zinc-800 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold tracking-tighter text-zinc-500 uppercase">
                  Dev Console
                </span>
                <div className="flex items-center gap-2 border-l border-zinc-700 pl-3">
                  <button
                    onClick={() => router.push("/inicio")}
                    className={`transition-all ${pathname?.startsWith("/inicio") || pathname === "/" ? "text-fuchsia-500 drop-shadow-[0_0_5px_rgba(217,70,239,0.8)] scale-110" : "text-zinc-500 hover:text-fuchsia-400"}`}
                    title="Ir a Inicio"
                  >
                    <Home size={14} />
                  </button>
                  <button
                    onClick={() => router.push("/gestion")}
                    className={`transition-all ${pathname?.startsWith("/gestion") ? "text-fuchsia-500 drop-shadow-[0_0_5px_rgba(217,70,239,0.8)] scale-110" : "text-zinc-500 hover:text-fuchsia-400"}`}
                    title="Ir a Gestión"
                  >
                    <LayoutGrid size={14} />
                  </button>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex border-b border-zinc-800">
              <button
                onClick={() => setActiveTab("users")}
                className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                  activeTab === "users" ? "bg-zinc-800/50 text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Usuarios
              </button>
              <button
                onClick={() => setActiveTab("features")}
                className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                  activeTab === "features" ? "bg-zinc-800/50 text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Features
              </button>
              <button
                onClick={() => setActiveTab("routes")}
                className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                  activeTab === "routes" ? "bg-zinc-800/50 text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Rutas
              </button>
            </div>

            <div className="p-5 space-y-6">
              {activeTab === "users" ? (
                <>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-black/40">
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                      {apiMode ? <Wifi size={14} className="text-lime-500" /> : <WifiOff size={14} className="text-zinc-600" />}
                      <span>Conexión API</span>
                    </div>
                    <button
                      onClick={() => {
                        const newMode = !apiMode;
                        setApiMode(newMode);
                        if (!newMode) {
                          logout(); 
                        }
                      }}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        apiMode ? "bg-lime-500" : "bg-zinc-700"
                      }`}
                    >
                      <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        apiMode ? "translate-x-5" : "translate-x-1"
                      }`} />
                    </button>
                  </div>

                  {apiMode ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-[10px] text-lime-500/70 font-bold uppercase tracking-widest">
                        <Users size={14} />
                        <span>Seleccionar Usuario Real</span>
                      </div>
                      {isLoadingUsers ? (
                        <div className="text-xs text-zinc-500 italic">Cargando usuarios...</div>
                      ) : (
                        <div className="relative">
                          <input 
                            type="text" 
                            placeholder="Buscar usuario por nombre o documento..." 
                            value={userSearchQuery}
                            onChange={e => {
                              setUserSearchQuery(e.target.value);
                              setIsDropdownOpen(true);
                            }}
                            onFocus={() => setIsDropdownOpen(true)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-lime-400 focus:outline-none focus:border-lime-500/50 transition-all placeholder:text-zinc-600"
                          />
                          {isDropdownOpen && (
                            <>
                              <div 
                                className="fixed inset-0 z-0" 
                                onClick={() => setIsDropdownOpen(false)}
                              />
                              <div className="dev-dropdown-scrollbar absolute z-10 w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl max-h-40 overflow-y-auto">
                                {filteredUsers.length === 0 ? (
                                  <div className="p-3 text-xs text-zinc-500 italic">No se encontraron usuarios</div>
                                ) : (
                                  filteredUsers.map(u => (
                                    <button
                                      key={u.documento}
                                      onClick={() => {
                                        login(u);
                                        setIsDropdownOpen(false);
                                        setUserSearchQuery("");
                                      }}
                                      className="w-full text-left px-3 py-2 text-xs hover:bg-zinc-800 transition-colors border-b border-zinc-800/50 last:border-0"
                                    >
                                      <div className="text-zinc-300 font-bold">{u.nombre} {u.apellido}</div>
                                      <div className="text-zinc-500">{u.documento} - <span className="text-lime-500/70 uppercase">{u.role}</span></div>
                                    </button>
                                  ))
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-[10px] text-fuchsia-500/70 font-bold uppercase tracking-widest">
                            <ShieldCheck size={14} />
                            <span>Roles de Usuario</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-1.5">
                          {ROLES.map(({ role, label, color, neon }) => (
                            <button
                              key={role ?? "guest"}
                              type="button"
                              onClick={() => setRoleOverride(role === roleOverride ? undefined : role)}
                              className={`relative px-1 py-1.5 rounded-md border text-[9px] font-black transition-all duration-300 text-center ${color} ${
                                roleOverride === role 
                                  ? `${neon} text-white` 
                                  : "border-zinc-800 text-zinc-500 hover:border-zinc-600"
                              }`}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[10px] text-cyan-500/70 font-bold uppercase tracking-widest">
                          <Database size={14} />
                          <span>Simulación de Datos</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1.5 min-w-0">
                            <span className="text-[9px] text-zinc-600 block uppercase font-bold tracking-wider">ID Usuario</span>
                            <div className="relative group">
                              <Fingerprint size={14} className="absolute left-2.5 top-2.5 text-zinc-600 group-focus-within:text-cyan-500 transition-colors" />
                              <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={mockUserId ?? ""}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/\D/g, "");
                                  setMockUserId(val ? Number(val) : null);
                                }}
                                className="w-full min-w-0 bg-zinc-900 border border-zinc-800 rounded-lg pl-7 pr-8 py-2 text-xs text-cyan-400 focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-zinc-800"
                                placeholder="000"
                              />
                              {mockUserId !== null && (
                                <button
                                  onClick={() => setMockUserId(null)}
                                  className="absolute right-1 top-1 bottom-1 px-1.5 rounded-md bg-zinc-800/40 border border-zinc-700/50 hover:border-rose-500/50 text-zinc-500 hover:text-rose-500 transition-all flex items-center justify-center"
                                  title="Limpiar"
                                >
                                  <X size={10} strokeWidth={3} />
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="space-y-1.5 min-w-0">
                            <span className="text-[9px] text-zinc-600 block uppercase font-bold tracking-wider">ID Colonia</span>
                            <div className="relative group w-full">
                              <MapPin size={14} className="absolute left-2.5 top-2.5 text-zinc-600 group-focus-within:text-amber-500 transition-colors" />
                              <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={mockColoniaId ?? ""}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/\D/g, "");
                                  setMockColoniaId(val ? Number(val) : null);
                                }}
                                className="w-full min-w-0 bg-zinc-900 border border-zinc-800 rounded-lg pl-7 pr-8 py-2 text-xs text-amber-400 focus:outline-none focus:border-amber-500/50 transition-all placeholder:text-zinc-800 disabled:opacity-50"
                                placeholder="NUL"
                                disabled={!showColoniaPicker}
                              />
                              {mockColoniaId !== null && (
                                <button
                                  onClick={() => setMockColoniaId(null)}
                                  className="absolute right-1 top-1 bottom-1 px-1.5 rounded-md bg-zinc-800/40 border border-zinc-700/50 hover:border-rose-500/50 text-zinc-500 hover:text-rose-500 transition-all flex items-center justify-center"
                                  title="Limpiar"
                                >
                                  <X size={10} strokeWidth={3} />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {user && (
                    <div className="bg-black/50 border border-zinc-800/50 rounded-xl p-4 space-y-2.5 relative">
                      <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-bold uppercase tracking-widest mb-1">
                        <Terminal size={14} />
                        <span>Datos del Usuario Activo</span>
                      </div>

                      <div className="space-y-2 text-[10px] max-h-52 overflow-y-auto pr-2 dev-dropdown-scrollbar">
                        {Object.entries(user)
                          .sort(([keyA], [keyB]) => {
                            const order = [
                              "id", 
                              "nombre", 
                              "apellido", 
                              "role", 
                              "codigo_colonia",
                              "tipo_doc", 
                              "documento", 
                              "ciudad", 
                              "departamento", 
                              "pais",
                              "correo",
                              "celular",
                              "fecha_nacimiento",
                              "genero",
                              "fecha_creacion"
                            ];
                            const indexA = order.indexOf(keyA);
                            const indexB = order.indexOf(keyB);
                            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                            if (indexA !== -1) return -1;
                            if (indexB !== -1) return 1;
                            return keyA.localeCompare(keyB);
                          })
                          .map(([key, value]) => {
                            const displayValue = value === null ? "null" : String(value);
                            const isRole = key === "role";
                            return (
                              <Fragment key={key}>
                                <div className="flex justify-between items-center group border-b border-zinc-800/30 pb-1 last:border-0">
                                  <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors uppercase whitespace-nowrap">{key}:</span>
                                  <span 
                                    className={isRole ? "text-lime-500 font-black underline decoration-lime-500/30" : "text-zinc-300 font-mono text-right truncate max-w-[60%]"} 
                                    title={displayValue}
                                  >
                                    {isRole ? displayValue.toUpperCase() : displayValue}
                                  </span>
                                </div>
                                {key === "codigo_colonia" && value !== null && (
                                  <div className="flex justify-between items-center group border-b border-zinc-800/30 pb-1 last:border-0 bg-amber-500/5 px-1 rounded">
                                    <span className="text-zinc-500 group-hover:text-amber-500/70 transition-colors uppercase whitespace-nowrap text-[9px]">↳ COLONIA:</span>
                                    <span className="text-amber-400 font-mono text-right truncate max-w-[65%] text-[9px]" title={!apiMode ? "Colonia Simulada (Mock)" : (fetchedColony ? [fetchedColony.ciudad, fetchedColony.departamento, fetchedColony.pais].filter(Boolean).join(", ") : "Cargando...")}>
                                      {!apiMode ? "Colonia Simulada" : (loadingColony ? "Cargando..." : (fetchedColony ? [fetchedColony.ciudad, fetchedColony.departamento, fetchedColony.pais].filter(Boolean).join(", ") : "Desconocida"))}
                                    </span>
                                  </div>
                                )}
                              </Fragment>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </>
              ) : activeTab === "features" ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[10px] text-amber-500/70 font-bold uppercase tracking-widest">
                    <ToggleRight size={14} />
                    <span>Feature Flags</span>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(featureFlags).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-black/40">
                        <span className="text-[10px] font-mono text-zinc-300">{key}</span>
                        <button
                          onClick={() => setFeatureFlag(key as any, !value)}
                          className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors ${
                            value ? "bg-amber-500" : "bg-zinc-700"
                          }`}
                        >
                          <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                            value ? "translate-x-4" : "translate-x-1"
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                // ROUTES TAB
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[10px] text-fuchsia-500/70 font-bold uppercase tracking-widest">
                    <Compass size={14} />
                    <span>Navegación Rápida</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => router.push("/inicio")}
                      className={`px-3 py-3 rounded-lg border text-[11px] font-black transition-all text-center ${
                        pathname?.startsWith("/inicio") || pathname === "/"
                          ? "border-fuchsia-500 bg-fuchsia-500/10 text-fuchsia-400 shadow-[0_0_10px_rgba(217,70,239,0.3)]"
                          : "border-zinc-800 bg-black/40 text-zinc-400 hover:text-fuchsia-400 hover:border-fuchsia-500/50"
                      }`}
                    >
                      INICIO
                    </button>
                    <button
                      onClick={() => router.push("/gestion")}
                      className={`px-3 py-3 rounded-lg border text-[11px] font-black transition-all text-center ${
                        pathname?.startsWith("/gestion")
                          ? "border-fuchsia-500 bg-fuchsia-500/10 text-fuchsia-400 shadow-[0_0_10px_rgba(217,70,239,0.3)]"
                          : "border-zinc-800 bg-black/40 text-zinc-400 hover:text-fuchsia-400 hover:border-fuchsia-500/50"
                      }`}
                    >
                      GESTIÓN
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}

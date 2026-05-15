"use client";

import { Bug, X, Terminal, User, Cpu, Layers, ShieldCheck, Database } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/auth/context/AuthContext";
import { useDev } from "../context/DevContext";
import { useDraggableAccessibility } from "@/features/accessibility/hooks/useDraggableAccessibility";
import { getButtonStyle, getPanelStyle } from "./DevToolbox.styles";
import { UserRole } from "@/types/user.types";

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

export default function DevToolbox() {
  const { user, effectiveRole } = useAuth();
  const { 
    roleOverride, 
    setRoleOverride, 
    mockUserId, 
    setMockUserId, 
    mockColoniaId, 
    setMockColoniaId,
    isDev 
  } = useDev();

  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [buttonPosition, setButtonPosition] = useState<"top-left" | "top-right" | "bottom-left" | "bottom-right">("top-left");
  
  const togglePanel = () => setIsOpen((prev) => !prev);
  
  const { ref, pos, corner, hasMoved, isDragging, isReady } =
    useDraggableAccessibility(setButtonPosition, buttonPosition);
    
  const wasOpenRef = useRef(false);
  const prevDraggingRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const handleButtonClick = () => {
    if (!hasMoved.current) {
      togglePanel();
    }
  };

  const showColoniaPicker =
    effectiveRole === "usuario" || effectiveRole === "lider_colonia";

  if (!mounted) return null;

  // Permitir visualización en desarrollo local aunque no esté la env var
  const shouldShow = isDev || process.env.NODE_ENV === "development";
  if (!shouldShow) return null;

  return (
    <>
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
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#4ade80_1px,transparent_1px)] [background-size:10px_10px]" />
          
          <Bug 
            size={28} 
            className={`transition-colors duration-300 ${isOpen ? "text-lime-500" : "text-zinc-500 group-hover:text-lime-400"}`} 
          />
          
          {/* Status Dot */}
          <div className={`absolute bottom-2 right-2 w-2 h-2 rounded-full shadow-[0_0_5px_currentColor] ${isDev ? "bg-lime-500 text-lime-500" : "bg-zinc-800 text-zinc-800"}`} />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.section
            style={getPanelStyle(pos, corner)}
            className="w-80 backdrop-blur-xl bg-black/90 border border-zinc-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden pointer-events-auto z-[9999] font-mono text-zinc-400"
            initial={{ opacity: 0, scale: 0.9, y: -20, rotateX: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20, rotateX: -10 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            {/* Console Header */}
            <div className="bg-zinc-900/50 px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/50" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                </div>
                <span className="text-[10px] font-bold tracking-tighter text-zinc-500 ml-2 uppercase">
                  Terminal.System_v2.0
                </span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-6">
              {/* Identity Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[10px] text-lime-500/70 font-bold uppercase tracking-widest">
                  <ShieldCheck size={14} />
                  <span>Access_Protocol</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {ROLES.map(({ role, label, color, neon }) => (
                    <button
                      key={role ?? "guest"}
                      type="button"
                      onClick={() => setRoleOverride(role === roleOverride ? undefined : role)}
                      className={`relative px-3 py-2.5 rounded-lg border text-[11px] font-black transition-all duration-300 ${color} ${
                        roleOverride === role 
                          ? `${neon} text-white` 
                          : "border-zinc-800 text-zinc-500 hover:border-zinc-600"
                      }`}
                    >
                      {label}
                      {roleOverride === role && (
                        <motion.div 
                          layoutId="active-glow"
                          className="absolute inset-0 rounded-lg bg-white/5 pointer-events-none"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Data Injection Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[10px] text-cyan-500/70 font-bold uppercase tracking-widest">
                  <Database size={14} />
                  <span>Data_Override</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <span className="text-[9px] text-zinc-600 block">ID_ENTITY</span>
                    <div className="relative group">
                      <Cpu size={12} className="absolute left-2.5 top-2.5 text-zinc-600 group-focus-within:text-cyan-500 transition-colors" />
                      <input
                        type="number"
                        value={mockUserId ?? ""}
                        onChange={(e) => setMockUserId(e.target.value ? Number(e.target.value) : null)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-3 py-2 text-xs text-cyan-400 focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-zinc-800"
                        placeholder="000"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[9px] text-zinc-600 block">COLONIA_HEX</span>
                    <div className="relative flex gap-1">
                      <Layers size={12} className="absolute left-2.5 top-2.5 text-zinc-600" />
                      <input
                        type="number"
                        value={mockColoniaId ?? ""}
                        onChange={(e) => setMockColoniaId(e.target.value ? Number(e.target.value) : null)}
                        className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-2 py-2 text-xs text-amber-400 focus:outline-none focus:border-amber-500/50 transition-all"
                        placeholder="NUL"
                        disabled={!showColoniaPicker}
                      />
                      <button
                        onClick={() => setMockColoniaId(null)}
                        className="px-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-rose-500/50 text-zinc-600 hover:text-rose-500 transition-all"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Log */}
              <div className="bg-black/50 border border-zinc-800/50 rounded-xl p-4 space-y-2.5 relative">
                <div className="absolute top-2 right-3 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-pulse" />
                  <span className="text-[8px] text-lime-500/50 uppercase font-bold tracking-tighter">Live</span>
                </div>
                
                <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-bold uppercase tracking-widest mb-1">
                  <Terminal size={14} />
                  <span>System_Logs</span>
                </div>

                <div className="space-y-2 text-[11px]">
                  {user ? (
                    <>
                      <div className="flex justify-between items-center group">
                        <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors">IDENTIFIER:</span>
                        <span className="text-zinc-300 font-bold">{user.nombre} {user.apellido}</span>
                      </div>
                      <div className="flex justify-between items-center group">
                        <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors">HASH_DOC:</span>
                        <span className="text-zinc-300">{user.documento}</span>
                      </div>
                      <div className="flex justify-between items-center group">
                        <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors">ROOT_ROLE:</span>
                        <span className="text-rose-500 font-black">{user.role.toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between items-center group pt-2 border-t border-zinc-800/50">
                        <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors">ACTIVE_STATE:</span>
                        <span className="text-lime-500 font-black underline decoration-lime-500/30">{(effectiveRole ?? "GUEST").toUpperCase()}</span>
                      </div>
                    </>
                  ) : (
                    <div className="py-2 text-center text-rose-500/50 italic animate-pulse">
                      NO_SESSION_DETECTED
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Footer Status Bar */}
            <div className="bg-lime-500/10 px-4 py-1.5 flex justify-between items-center">
              <span className="text-[8px] text-lime-500/50 font-bold">NODE_STATUS: STABLE</span>
              <span className="text-[8px] text-lime-500/50 font-bold">LATENCY: 24MS</span>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}

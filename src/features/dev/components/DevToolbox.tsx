"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "@/auth/context/AuthContext";
import { useDev } from "../context/DevContext";
import { useMagneticDraggable } from "@/hooks/useMagneticDraggable";
import { getButtonStyle, getPanelStyle } from "./DevToolbox.styles";
import { DevButton } from "./DevButton";
import { DevPanel } from "./DevPanel";
import { UserData } from "@/types/user.types";

export default function DevToolboxWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <MockAuthSync />
      <DevToolbox />
    </>
  );
}

function MockAuthSync() {
  const { apiMode, roleOverride, mockColoniaId, mockUserId, isDev } = useDev();
  const { user, login } = useAuth();

  useEffect(() => {
    if (!isDev || apiMode) return;
    if (roleOverride === undefined) return;

    const currentUserId = user?.id;
    const currentUserRole = user?.role;
    const currentColoniaId = user?.codigo_colonia ?? null;

    const targetUserId = mockUserId ?? 9999;
    const targetColoniaId = mockColoniaId ?? null;

    if (
      currentUserId !== targetUserId ||
      currentUserRole !== roleOverride ||
      currentColoniaId !== targetColoniaId
    ) {
      const mockUser: UserData = {
        ...(user ?? ({} as UserData)),
        id: targetUserId,
        role: roleOverride,
        codigo_colonia: targetColoniaId,
        fecha_creacion: user?.fecha_creacion ?? new Date().toISOString(),
        tipo_doc: user?.tipo_doc ?? "CC",
        documento: user?.documento ?? "0000000000",
        celular: user?.celular ?? "0000000000",
        correo: user?.correo ?? "mock@dev.com",
        nombre: user?.nombre ?? "Usuario",
        apellido: user?.apellido ?? "Mock",
        genero: user?.genero ?? "otro",
        fecha_nacimiento: user?.fecha_nacimiento ?? "2000-01-01",
        pais: user?.pais ?? "Colombia",
        departamento: user?.departamento ?? null,
        ciudad: user?.ciudad ?? null,
        codigo_retorno: user?.codigo_retorno ?? null,
      };
      
      login(mockUser);
    }
  }, [isDev, apiMode, roleOverride, mockColoniaId, mockUserId, user, login]);

  return null;
}

function DevToolbox() {
  const { isDev } = useDev();

  const [isOpen, setIsOpen] = useState(false);
  const [buttonPosition, setButtonPosition] = useState<"top-left" | "top-right" | "bottom-left" | "bottom-right">("top-right");

  const togglePanel = () => setIsOpen((prev) => !prev);

  const { ref, pos, corner, hasMoved, isDragging, isReady } =
    useMagneticDraggable(setButtonPosition, buttonPosition);

  const wasOpenRef = useRef(false);
  const prevDraggingRef = useRef(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (isDragging && !prevDraggingRef.current) {
      wasOpenRef.current = isOpen;
      if (isOpen) {
        timer = setTimeout(() => setIsOpen(false), 0);
      }
    } else if (!isDragging && prevDraggingRef.current && wasOpenRef.current) {
      timer = setTimeout(() => setIsOpen(true), 0);
    }
    prevDraggingRef.current = isDragging;

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isDragging, isOpen]);

  const handleButtonClick = () => {
    if (!hasMoved.current) {
      togglePanel();
    }
  };

  if (!isDev) return null;

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

      <DevButton
        isOpen={isOpen}
        onClick={handleButtonClick}
        pos={pos}
        isDragging={isDragging}
        isReady={isReady}
        getButtonStyle={getButtonStyle}
        buttonRef={ref}
      />

      <AnimatePresence>
        {isOpen && (
          <DevPanel
            pos={pos}
            corner={corner}
            getPanelStyle={getPanelStyle}
            onClose={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

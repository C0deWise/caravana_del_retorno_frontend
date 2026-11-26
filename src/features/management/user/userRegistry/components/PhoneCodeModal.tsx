"use client";

import React, { useMemo, useState } from "react";
import { Search, Check } from "lucide-react";
import { FrostedModal } from "@/components/feedback/FrostedModal";
import { getAllCountries } from "@/constants/countries";

interface PhoneCodeModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly selectedCode: string;
  readonly onSelect: (code: string) => void;
}

export default function PhoneCodeModal({
  isOpen,
  onClose,
  selectedCode,
  onSelect,
}: PhoneCodeModalProps) {
  const [query, setQuery] = useState("");

  const { colombia, others } = useMemo(() => {
    const all = getAllCountries();
    const q = query.trim().toLowerCase();
    const filtered = q
      ? all.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            `+${c.phonecode}`.includes(q) ||
            String(c.phonecode).includes(q)
        )
      : all;

    const col = filtered.find((c) => c.name === "Colombia") ?? null;
    const rest = filtered.filter((c) => c.name !== "Colombia");
    return { colombia: col, others: rest };
  }, [query]);

  const handleChoose = (phonecode: number) => {
    onSelect(`+${phonecode}`);
    setQuery("");
    onClose();
  };

  return (
    <FrostedModal
      isOpen={isOpen}
      onClose={() => {
        setQuery("");
        onClose();
      }}
      title="Seleccione el indicativo"
      maxWidth="max-w-lg"
    >
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar país o indicativo (ej. Colombia, +57)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 bg-white text-sm text-gray-900 outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
          />
        </div>

        <div className="max-h-72 overflow-y-auto pr-1 space-y-1">
          {colombia && (
            <>
              <button
                type="button"
                onClick={() => handleChoose(colombia.phonecode)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-colors cursor-pointer ${
                  selectedCode === `+${colombia.phonecode}`
                    ? "bg-primary/10 text-primary font-semibold"
                    : "hover:bg-gray-100 text-gray-800"
                }`}
              >
                <span className="flex items-center gap-2 truncate">
                  {selectedCode === `+${colombia.phonecode}` && <Check className="w-4 h-4 shrink-0" />}
                  <span className="truncate">{colombia.name}</span>
                </span>
                <span className="font-mono text-xs font-semibold text-gray-500 shrink-0">
                  +{colombia.phonecode}
                </span>
              </button>
              {others.length > 0 && (
                <div className="py-1 flex items-center justify-center">
                  <div className="h-[1.5px] w-full rounded-full bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20" />
                </div>
              )}
            </>
          )}

          {others.map((country) => {
            const code = `+${country.phonecode}`;
            const isSelected = selectedCode === code;
            return (
              <button
                key={country.id}
                type="button"
                onClick={() => handleChoose(country.phonecode)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-primary/10 text-primary font-semibold"
                    : "hover:bg-gray-100 text-gray-800"
                }`}
              >
                <span className="flex items-center gap-2 truncate">
                  {isSelected && <Check className="w-4 h-4 shrink-0" />}
                  <span className="truncate">{country.name}</span>
                </span>
                <span className="font-mono text-xs font-semibold text-gray-500 shrink-0">
                  {code}
                </span>
              </button>
            );
          })}

          {!colombia && others.length === 0 && (
            <p className="text-center text-sm text-gray-500 py-6">
              No se encontraron países con ese criterio.
            </p>
          )}
        </div>
      </div>
    </FrostedModal>
  );
}

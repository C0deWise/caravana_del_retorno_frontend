"use client";

import { useMemo, useState } from "react";
import { useCreateRetorno } from "../hooks/useCreateRetorno";

export default function CrearRetorno() {
  const { createRetorno, loading, error, success, resetState } =
    useCreateRetorno();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showModal, setShowModal] = useState(false);

  const monthNames = useMemo(
    () => [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ],
    [],
  );

  const fullMonthNames = useMemo(
    () => [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ],
    [],
  );

  const dayNames = useMemo(
    () => ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    [],
  );

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const daysArray: Array<Date | null> = [];
    const startDayOfWeek = firstDay.getDay();

    for (let i = 0; i < startDayOfWeek; i++) {
      daysArray.push(null);
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      daysArray.push(new Date(year, month, day));
    }

    return daysArray;
  };

  const formatDate = (date: Date) => {
    return `${date.getDate()} de ${fullMonthNames[date.getMonth()]} del ${date.getFullYear()}`;
  };

  const isSameDate = (dateA: Date, dateB: Date) => {
    return (
      dateA.getDate() === dateB.getDate() &&
      dateA.getMonth() === dateB.getMonth() &&
      dateA.getFullYear() === dateB.getFullYear()
    );
  };

  const handleDateClick = (date: Date) => {
    resetState();
    setSelectedDate(date);
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };

  const handleCreateClick = () => {
    if (!selectedDate || loading) return;
    resetState();
    setShowModal(true);
  };

  const handleConfirm = async () => {
    if (!selectedDate) return;

    const response = await createRetorno({
      anio: selectedDate.getFullYear(),
      estado: "activo",
    });

    if (response) {
      setShowModal(false);
      setSelectedDate(null);
    }
  };

  const handleCancel = () => {
    if (loading) return;
    setShowModal(false);
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="flex min-h-screen flex-col bg-(--color-bg)">
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
          <h1 className="mb-2 text-center text-2xl font-bold text-blue-900">
            Creación de un retorno
          </h1>

          <h2 className="mb-6 text-center text-lg text-blue-900">
            Seleccione el año del retorno
          </h2>

          {error && (
            <div className="alert-error mb-4">
              <p className="alert-error-text">{error}</p>
            </div>
          )}

          {success && (
            <div className="alert-success mb-4">
              <p className="alert-success-text">Retorno creado exitosamente</p>
            </div>
          )}

          <div className="mb-6">
            <div className="mb-4 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePreviousMonth}
                className="rounded p-2 hover:bg-gray-100"
                aria-label="Mes anterior"
              >
                &#60;
              </button>

              <div className="flex items-center gap-2">
                <span className="font-semibold">
                  {monthNames[currentMonth.getMonth()]}
                </span>
                <span className="font-semibold">
                  {currentMonth.getFullYear()}
                </span>
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                className="rounded p-2 hover:bg-gray-100"
                aria-label="Mes siguiente"
              >
                &#62;
              </button>
            </div>

            <div className="mb-2 grid grid-cols-7 gap-1">
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="py-2 text-center text-xs font-medium text-gray-600"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => (
                <div key={`${day?.toISOString() ?? "empty"}-${index}`}>
                  {day ? (
                    <button
                      type="button"
                      onClick={() => handleDateClick(day)}
                      className={`flex aspect-square w-full items-center justify-center rounded text-sm transition-colors ${
                        selectedDate && isSameDate(day, selectedDate)
                          ? "bg-blue-600 text-white"
                          : "hover:bg-gray-200"
                      }`}
                      aria-label={`Seleccionar ${formatDate(day)}`}
                    >
                      {day.getDate()}
                    </button>
                  ) : (
                    <div className="aspect-square w-full" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={handleCreateClick}
              disabled={!selectedDate || loading}
              className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-white transition-opacity hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? "Creando..." : "Crear"}
            </button>
          </div>
        </div>
      </div>

      {showModal && selectedDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-center text-xl font-bold">
              ¿Confirmas la creación del retorno?
            </h3>

            <div className="mb-6 text-center">
              <p className="text-lg font-semibold">
                • Año: {selectedDate.getFullYear()}
              </p>
              <p className="text-sm text-gray-600">Estado: activo</p>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleConfirm}
                disabled={loading}
                className="flex-1 rounded-lg bg-green-500 py-3 font-semibold text-white transition-opacity hover:bg-green-600 disabled:opacity-50"
              >
                {loading ? "Confirmando..." : "Confirmar"}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="flex-1 rounded-lg bg-red-800 py-3 font-semibold text-white transition-opacity hover:bg-red-900 disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

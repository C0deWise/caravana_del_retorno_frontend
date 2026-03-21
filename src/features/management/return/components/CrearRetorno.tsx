"use client";

import { useState } from "react";
import { useCreateRetorno } from "../hooks/useCreateRetorno";

export default function CrearRetorno() {
  const { createRetorno, loading, error, success } = useCreateRetorno();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showModal, setShowModal] = useState(false);

  // Función para obtener los días del mes
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const daysArray = [];
    const startDayOfWeek = firstDay.getDay();

    // Agregar días vacíos del mes anterior
    for (let i = 0; i < startDayOfWeek; i++) {
      daysArray.push(null);
    }

    // Agregar todos los días del mes
    for (let day = 1; day <= lastDay.getDate(); day++) {
      daysArray.push(new Date(year, month, day));
    }

    return daysArray;
  };

  // Función para formatear la fecha
  const formatDate = (date: Date) => {
    const months = [
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
    ];
    return `${date.getDate()} de ${months[date.getMonth()]} del ${date.getFullYear()}`;
  };

  // Función para formatear fecha en formato ISO
  const formatDateISO = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
    );
  };

  const handleCreateClick = () => {
    if (selectedDate) {
      setShowModal(true);
    }
  };

  const handleConfirm = async () => {
    if (selectedDate) {
      await createRetorno({
        re_fecha_creacion: formatDateISO(selectedDate),
      });
      setShowModal(false);
      // Resetear la fecha seleccionada después de crear
      if (success) {
        setSelectedDate(null);
      }
    }
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
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
  ];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div
      className="flex flex-col min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* Contenido principal */}
      <div className="flex-1 flex justify-center items-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
          <h1
            className="text-2xl font-bold text-center mb-2"
            style={{ color: "#1E3A8A" }}
          >
            Creación de un retorno
          </h1>

          <h2 className="text-lg text-center mb-6" style={{ color: "#1E3A8A" }}>
            Seleccione la fecha del retorno
          </h2>

          {/* Mensajes de estado */}
          {error && (
            <div className="alert-error">
              <p className="alert-error-text">{error}</p>
            </div>
          )}

          {success && (
            <div className="alert-success">
              <p className="alert-success-text">Colonia creada exitosamente</p>
            </div>
          )}

          {/* Calendario */}
          <div className="mb-6">
            {/* Header del calendario */}
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={handlePreviousMonth}
                className="p-2 hover:bg-gray-100 rounded"
                type="button"
              >
                &#60;
              </button>
              <div className="flex gap-2 items-center">
                <span className="font-semibold">
                  {monthNames[currentMonth.getMonth()]}
                </span>
                <span className="font-semibold">
                  {currentMonth.getFullYear()}
                </span>
              </div>
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-gray-100 rounded"
                type="button"
              >
                &#62;
              </button>
            </div>

            {/* Días de la semana */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-gray-600 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Días del mes */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => (
                <div key={index}>
                  {day ? (
                    <button
                      type="button"
                      onClick={() => handleDateClick(day)}
                      className={`w-full aspect-square flex items-center justify-center rounded text-sm transition-colors ${selectedDate &&
                          day.getDate() === selectedDate.getDate() &&
                          day.getMonth() === selectedDate.getMonth() &&
                          day.getFullYear() === selectedDate.getFullYear()
                          ? "bg-primary text-white"
                          : "hover:bg-gray-200"
                        }`}
                    >
                      {day.getDate()}
                    </button>
                  ) : (
                    <div className="w-full aspect-square"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Botón Crear */}
          <div className="mt-6">
            <button
              type="button"
              onClick={handleCreateClick}
              disabled={!selectedDate || loading}
              className="w-full py-3 rounded-lg font-semibold transition-opacity disabled:opacity-50"
              style={{
                backgroundColor: "#F97316",
                color: "white",
              }}
            >
              Crear
            </button>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showModal && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-xl font-bold text-center mb-4">
              ¿Confirmas la creación del retorno?
            </h3>
            <div className="text-center mb-6">
              <p className="text-lg font-semibold">
                • {formatDate(selectedDate)}
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="flex-1 py-3 rounded-lg font-semibold transition-opacity disabled:opacity-50"
                style={{
                  backgroundColor: "#22C55E",
                  color: "white",
                }}
              >
                {loading ? "Confirmando..." : "Confirmar"}
              </button>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="flex-1 py-3 rounded-lg font-semibold transition-opacity disabled:opacity-50"
                style={{
                  backgroundColor: "#991B1B",
                  color: "white",
                }}
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

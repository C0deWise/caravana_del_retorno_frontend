import { useState } from "react";
import type { ReturnRegistrationApi } from "../../types/returnRegistration.types";

type ManagementView = "actions" | "edit" | "unregistered";

interface UseReturnRegistrationManagementReturn {
  view: ManagementView;
  currentRegistration: ReturnRegistrationApi;
  goToEdit: () => void;
  goToActions: (updated: ReturnRegistrationApi) => void;
  handleUnregistered: () => void;
}

export function useReturnRegistrationManagement(
  initialRegistration: ReturnRegistrationApi
): UseReturnRegistrationManagementReturn {
  const [view, setView] = useState<ManagementView>("actions");
  const [currentRegistration, setCurrentRegistration] =
    useState<ReturnRegistrationApi>(initialRegistration);

  const goToEdit = () => setView("edit");

  const goToActions = (updated: ReturnRegistrationApi) => {
    setCurrentRegistration(updated);
    setView("actions");
  };

  const handleUnregistered = () => setView("unregistered");

  return {
    view,
    currentRegistration,
    goToEdit,
    goToActions,
    handleUnregistered,
  };
}
export const normalizeString = (value: string): string =>
  value.toLowerCase().trim();

export const normalizeText = (value: string): string =>
  normalizeString(value)
    .normalize("NFD")
    .replaceAll(/[\u0300-\u036f]/g, "");

export const formatDate = (dateString: string): string => {
  if (!dateString) {
    return "—";
  }

  return new Date(dateString).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

export const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birthDateObj = new Date(birthDate + "T00:00:00");
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const m = today.getMonth() - birthDateObj.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
    age--;
  }

  return age;
};

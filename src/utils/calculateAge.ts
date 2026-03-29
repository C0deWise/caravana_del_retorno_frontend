export default function calculateAge(birthDate: string): number {
  const today = new Date();
  const birthDateObj = new Date(birthDate + "T00:00:00");
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const m = today.getMonth() - birthDateObj.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
    age--;
  }
  return age;
}
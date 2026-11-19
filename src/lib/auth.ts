/** Phone + password accounts without SMS: the phone is mapped to a technical e-mail used only as the login id. */
export function phoneToEmail(phone: string): string {
  return `${phone.replace(/\D/g, "")}@users.qarzdaftar.uz`;
}

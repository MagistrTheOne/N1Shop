type AuthErrorKind = "login" | "register" | "generic";

export function authErrorMessage(error: unknown, kind: AuthErrorKind = "generic") {
  const value = error && typeof error === "object" ? error as { message?: unknown; code?: unknown } : {};
  const code = typeof value.code === "string" ? value.code.toLowerCase() : "";
  const message = typeof value.message === "string" ? value.message.toLowerCase() : "";

  if (kind === "login" && (code.includes("email_not_verified") || message.includes("email not verified"))) {
    return "Подтвердите email по коду из письма, затем войдите.";
  }
  if (message.includes("password") && (message.includes("length") || message.includes("weak") || message.includes("policy"))) {
    return "Пароль не соответствует требованиям. Используйте не менее 8 символов.";
  }
  if (kind === "register") {
    return "Не удалось создать аккаунт. Проверьте данные или войдите в существующий аккаунт.";
  }
  if (kind === "login") return "Не удалось войти. Проверьте email и пароль.";
  return "Не удалось выполнить запрос. Проверьте данные и попробуйте ещё раз.";
}

export function requiresEmailVerification(error: unknown) {
  const value = error && typeof error === "object" ? error as { message?: unknown; code?: unknown } : {};
  const code = typeof value.code === "string" ? value.code.toLowerCase() : "";
  const message = typeof value.message === "string" ? value.message.toLowerCase() : "";
  return code.includes("email_not_verified") || message.includes("email not verified");
}

export function safeInternalRedirect(value: unknown, fallback = "/account") {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return fallback;
  try {
    const url = new URL(value, "https://n1.invalid");
    if (url.origin !== "https://n1.invalid" || ["/login", "/register", "/forgot-password", "/reset-password"].includes(url.pathname)) return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}

export function normalizedEmail(value: FormDataEntryValue | null) {
  return String(value || "").trim().toLowerCase();
}

"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function PasswordField({ name, label, autoComplete, minLength = 8 }: {
  name: string;
  label: string;
  autoComplete: string;
  minLength?: number;
}) {
  const [visible, setVisible] = useState(false);
  return <label>{label}<span className="n1-password-field">
    <input name={name} type={visible ? "text" : "password"} autoComplete={autoComplete} required minLength={minLength} maxLength={128}/>
    <button type="button" aria-label={visible ? "Скрыть пароль" : "Показать пароль"} onClick={() => setVisible(value => !value)}>{visible ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
  </span></label>;
}

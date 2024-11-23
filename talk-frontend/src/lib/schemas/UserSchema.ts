"use client";

import { z } from "zod";

// Update user
export const updateUserSchema = z.object({
  name: z.string().min(1, { message: "Nome obrigatório" }).max(80, { message: "Nome extenso demais" }),
  email: z.string().email({ message: "Email inválido" }).max(254, { message: "Email extenso demais" }),
  password: z
    .string()
    .max(80, { message: "Senha extensa demais" })
    .refine(value => !value || /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9\s]).+$/.test(value), { message: "A senha deve conter pelo menos uma letra, um número e um caracter especial" }),
  confirm_password: z.string()
}).refine(data => data.password === data.confirm_password, {message: "A confirmação da senha falhou", path: ["confirm_password"]})

export type UpdateUserData = z.infer<typeof updateUserSchema>


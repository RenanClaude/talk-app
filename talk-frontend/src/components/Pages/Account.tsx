"use client";

import { updateUser } from "@/lib/requests";
import { SignInData } from "@/lib/schemas/AuthSchemas";
import { UpdateUserData, updateUserSchema } from "@/lib/schemas/UserSchema";
import { handleSignIn } from "@/lib/server/auth";
import { useAuthStore } from "@/stores/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import router from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const AccountPage = () => {
  const { user, setUser } = useAuthStore();

  const [loading, setLoading] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  const form = useForm<UpdateUserData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user?.name,
      email: user?.email,
      password: "",
      confirm_password: "",
    },
  });

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatar(file);
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: UpdateUserData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("avatar", avatar || "");

    setLoading(true);
    const response = await updateUser(formData);
    setLoading(false);

    if (response.error) {
      toast.error(response.error.message, { position: "top-center" });
      return;
    }

    const user = response.data.user;
    setUser(user);

    form.setValue("name", user.name);
    form.setValue("email", user.email);
    form.setValue("password", "");
    form.setValue("confirm_password", "");

    setAvatar(null);
    toast.success("Dados atualizados com sucesso!", { position: "top-center" });
  };

  return <div></div>;
};

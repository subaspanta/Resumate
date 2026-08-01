"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/features/auth";
import { isApiError } from "@/src/api/api-error";
import { toast } from "sonner";
import { AuthFormField } from "./AuthFormField";
import { PasswordStrengthChecklist } from "./PasswordStrengthChecklist";
import { AuthFooterPrompt } from "./AuthFooterPrompt";
import { AuthSubmitButton } from "./AuthSubmitButton";
import { registerSchema, type RegisterFormValues } from "../auth.schemas";

export function RegisterForm() {
  const { register: registerUser, isRegistering: isLoading } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isValid },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const password = watch("password", "");

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      toast.success("Account created successfully!");
      router.push("/");
    } catch (error) {
      if (isApiError(error)) {
        if (error.code === "EMAIL_ALREADY_EXISTS") {
          setError("email", {
            type: "manual",
            message: "An account with this email already exists",
          });
          toast.error("Registration failed: Email already registered.");
        } else if (error.code === "VALIDATION_FAILED") {
          toast.error("Registration failed: Please correct the highlighted fields.");
        } else if (error.status === 0) {
          toast.error("Registration failed. Please check your network connection.");
        } else {
          toast.error(error.message || "Registration failed. Please try again.");
        }
      } else {
        toast.error("Registration failed. Please try again.");
      }
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="auth-form auth-form--register"
      >
        <AuthFormField
          id="name"
          label="Full Name"
          type="text"
          placeholder="John Doe"
          registration={register("name")}
          error={errors.name?.message}
          disabled={isLoading}
          variant="register"
        />

        <AuthFormField
          id="email"
          label="Email"
          type="email"
          placeholder="name@company.com"
          registration={register("email")}
          error={errors.email?.message}
          disabled={isLoading}
          variant="register"
        />

        <AuthFormField
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          registration={register("password")}
          error={errors.password?.message}
          disabled={isLoading}
          showPasswordToggle
          variant="register"
          footer={<PasswordStrengthChecklist password={password} />}
        />

        <AuthFormField
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          registration={register("confirmPassword")}
          error={errors.confirmPassword?.message}
          disabled={isLoading}
          showPasswordToggle
          variant="register"
        />

        <AuthSubmitButton
          isLoading={isLoading}
          disabled={!isValid}
          loadingText="Creating Account..."
          variant="register"
        >
          Create Account
        </AuthSubmitButton>
      </form>

      <div className="auth-register-divider">
        <AuthFooterPrompt
          promptText="Already have an account?"
          linkText="Sign In"
          href="/login"
          variant="register"
        />
      </div>
    </>
  );
}

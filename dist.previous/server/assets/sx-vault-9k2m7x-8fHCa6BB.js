import { jsx, jsxs } from "react/jsx-runtime";
import { useNavigate, useRouter, Link } from "@tanstack/react-router";
import * as React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, Mail, Lock } from "lucide-react";
import { c as cn, B as Button } from "./button-DjOZMqFS.js";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva } from "class-variance-authority";
import { s as supabase } from "./client-B6X92QMo.js";
import "@radix-ui/react-slot";
import "clsx";
import "tailwind-merge";
import "@supabase/supabase-js";
const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(LabelPrimitive.Root, { ref, className: cn(labelVariants(), className), ...props }));
Label.displayName = LabelPrimitive.Root.displayName;
function AdminLoginPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const {
      data: signIn,
      error
    } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password
    });
    if (error || !signIn.user) {
      setLoading(false);
      toast.error(error?.message ?? "Login failed");
      return;
    }
    const {
      data: role
    } = await supabase.from("user_roles").select("role").eq("user_id", signIn.user.id).eq("role", "admin").maybeSingle();
    if (!role) {
      await supabase.auth.signOut();
      setLoading(false);
      toast.error("This account is not an admin.");
      return;
    }
    await router.invalidate();
    navigate({
      to: "/control-panel",
      replace: true
    });
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-mesh flex items-center justify-center px-4 py-10", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-gradient sky-glow", children: /* @__PURE__ */ jsx(ShieldCheck, { className: "h-7 w-7 text-primary-foreground" }) }),
      /* @__PURE__ */ jsx("h1", { className: "mt-4 text-3xl font-bold tracking-tight", children: "Secure Console" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Restricted area · administrators only" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "glass-panel rounded-2xl p-8 sky-glow border border-sky", children: [
      /* @__PURE__ */ jsxs("form", { onSubmit, className: "space-y-5", children: [
        /* @__PURE__ */ jsx(Field, { id: "email", label: "Admin email", icon: /* @__PURE__ */ jsx(Mail, { className: "h-4 w-4" }), children: /* @__PURE__ */ jsx(Input, { id: "email", type: "email", required: true, autoComplete: "username", placeholder: "admin@sleepox.com", className: "pl-10 h-11", value: email, onChange: (e) => setEmail(e.target.value) }) }),
        /* @__PURE__ */ jsx(Field, { id: "password", label: "Password", icon: /* @__PURE__ */ jsx(Lock, { className: "h-4 w-4" }), children: /* @__PURE__ */ jsx(Input, { id: "password", type: "password", required: true, autoComplete: "current-password", placeholder: "••••••••", className: "pl-10 h-11", value: password, onChange: (e) => setPassword(e.target.value) }) }),
        /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full h-11 text-base font-semibold bg-sky-gradient text-primary-foreground", disabled: loading, children: loading ? "Verifying..." : "Enter console" })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "mt-6 text-center text-xs text-muted-foreground", children: [
        "Not an admin? ",
        /* @__PURE__ */ jsx(Link, { to: "/login", className: "text-primary hover:underline", children: "User login" })
      ] })
    ] })
  ] }) });
}
function Field({
  id,
  label,
  icon,
  children
}) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsx(Label, { htmlFor: id, className: "text-sm font-medium", children: label }),
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx("span", { className: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground", children: icon }),
      children
    ] })
  ] });
}
export {
  AdminLoginPage as component
};

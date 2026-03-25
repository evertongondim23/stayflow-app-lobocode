import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useHotel } from "../context/HotelContext";
import { Button, Card, CardContent, Input } from "../components/ui";
import {
  LogIn,
  LayoutDashboard,
  ShieldCheck,
  Mail,
  Lock,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { BrandLogo } from "../components/BrandLogo";
import { PATHS } from "../routes";

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export function LoginPage() {
  const navigate = useNavigate();
  const { reservations } = useHotel();
  const quickRef = useRef<HTMLElement>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const invitedRes = reservations.find((r) => r.status === "INVITED");

  const scrollToQuickAccess = () => {
    quickRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const em = email.trim();
    if (!em) {
      toast.error("Informe o e-mail.");
      return;
    }
    if (!isValidEmail(em)) {
      toast.error("Digite um e-mail válido.");
      return;
    }
    if (!password) {
      toast.error("Informe a senha.");
      return;
    }
    toast.success(
      "Credenciais aceitas no modo demo. Não há servidor de autenticação — use um dos acessos abaixo para continuar.",
      { duration: 4500 }
    );
    scrollToQuickAccess();
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-sky-50/40 font-sans text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-lg flex-col px-5 pb-16 pt-10 sm:px-6 sm:pt-14 lg:max-w-6xl">
        <header className="mb-8 text-center lg:mb-10">
          <div className="flex justify-center py-2">
            <BrandLogo height={44} className="mx-auto max-h-11" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Bem-vindo de volta
          </h1>
          <p className="mt-2 max-w-md mx-auto text-sm text-slate-500 sm:text-base">
            Entre com sua conta corporativa. No ambiente de demonstração, o
            login valida apenas o formulário — a entrada nos painéis é pelos
            atalhos abaixo.
          </p>
        </header>

        <main className="flex flex-1 flex-col gap-12 lg:flex-row lg:items-start lg:justify-center lg:gap-16">
          <Card className="w-full max-w-md shrink-0 border-slate-200/80 shadow-lg shadow-slate-200/50 lg:mx-0">
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="login-email"
                    className="text-sm font-medium text-slate-700"
                  >
                    E-mail
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                      aria-hidden
                    />
                    <Input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      placeholder="voce@hotel.com.br"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 rounded-xl border-slate-200 pl-10 focus-visible:ring-sky-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <label
                      htmlFor="login-password"
                      className="text-sm font-medium text-slate-700"
                    >
                      Senha
                    </label>
                    <button
                      type="button"
                      className="text-xs font-medium text-sky-600 hover:text-sky-700 hover:underline"
                      onClick={() =>
                        toast.message("Recuperação de senha virá na versão com backend.", {
                          description: "Por enquanto, use os acessos de demonstração.",
                        })
                      }
                    >
                      Esqueci a senha
                    </button>
                  </div>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                      aria-hidden
                    />
                    <Input
                      id="login-password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 rounded-xl border-slate-200 pl-10 focus-visible:ring-sky-500"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="h-11 w-full rounded-xl bg-sky-600 text-base font-semibold shadow-md shadow-sky-600/25 hover:bg-sky-700"
                >
                  Entrar
                </Button>
              </form>

              <p className="mt-6 text-center text-xs text-slate-500">
                <button
                  type="button"
                  onClick={() =>
                    navigate(PATHS.demo)
                  }
                  className="inline-flex items-center gap-1 font-medium text-sky-600 hover:text-sky-700 hover:underline"
                >
                  <Sparkles className="size-3.5" aria-hidden />
                  Modo simulação com personas (hóspedes)
                </button>
              </p>
            </CardContent>
          </Card>

          <section
            ref={quickRef}
            id="acesso-rapido"
            className="w-full max-w-md flex-1 scroll-mt-8 lg:max-w-xl lg:pt-2"
            aria-labelledby="acesso-rapido-titulo"
          >
            <div className="mb-4 flex items-center gap-3 lg:justify-start">
              <div className="h-px flex-1 bg-slate-200 lg:max-w-16" />
              <h2
                id="acesso-rapido-titulo"
                className="shrink-0 text-center text-xs font-bold uppercase tracking-widest text-slate-400 lg:text-left"
              >
                Acesso demonstração
              </h2>
              <div className="h-px flex-1 bg-slate-200 lg:flex-1" />
            </div>

            <p className="mb-5 text-center text-sm text-slate-500 lg:text-left">
              Atalhos para o MVP, sem autenticação real.
            </p>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() =>
                  invitedRes
                    ? navigate(PATHS.guest.checkin(invitedRes.id))
                    : toast.error("Não há reserva em pré-check-in no demo.")
                }
                className="group flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all hover:border-sky-300 hover:shadow-md hover:shadow-sky-100/80"
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600 transition-transform group-hover:scale-105">
                  <LogIn className="size-6" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-800">Pré-check-in</p>
                  <p className="text-sm text-slate-500">
                    Fluxo do hóspede: documentos e assinatura
                  </p>
                </div>
                <ArrowRight className="size-5 shrink-0 text-slate-300 transition-colors group-hover:text-sky-500" />
              </button>

              <button
                type="button"
                onClick={() => navigate(PATHS.reception)}
                className="group flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all hover:border-sky-400 hover:shadow-md hover:shadow-sky-100/80"
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/30 transition-transform group-hover:scale-105">
                  <LayoutDashboard className="size-6" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-800">Painel recepção</p>
                  <p className="text-sm text-slate-500">
                    Chegadas, quartos e hóspedes
                  </p>
                </div>
                <ArrowRight className="size-5 shrink-0 text-slate-300 transition-colors group-hover:text-sky-500" />
              </button>

              <button
                type="button"
                onClick={() => navigate(PATHS.admin.root)}
                className="group flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all hover:border-orange-400/60 hover:shadow-md hover:shadow-orange-100/80"
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white shadow-md shadow-orange-500/25 transition-transform group-hover:scale-105">
                  <ShieldCheck className="size-6" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-800">Painel administrativo</p>
                  <p className="text-sm text-slate-500">
                    Configurações, estrutura e políticas
                  </p>
                </div>
                <ArrowRight className="size-5 shrink-0 text-slate-300 transition-colors group-hover:text-orange-500" />
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

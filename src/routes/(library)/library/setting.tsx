import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Bell,
  CreditCard,
  KeyRound,
  Loader2,
  LogOut,
  Palette,
  Shield,
  Trash2,
  User,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Typography } from "@/components/ui/typography";
import { useSubscription } from "@/hooks/useSubscription";
import {
  authClient,
  changePassword,
  signOut,
} from "@/lib/auth/auth-client";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";

export const Route = createFileRoute("/(library)/library/setting")({
  component: SettingsPage,
});

function SettingsPage() {
  const { auth: session } = Route.useRouteContext();
  const { subscription, isActive, isFree } = useSubscription();
  const theme = useTheme();

  const user = session?.user;

  const [name, setName] = useState("");
  const [nameInitialized, setNameInitialized] = useState(false);
  if (user?.name && !nameInitialized) {
    setName(user.name);
    setNameInitialized(true);
  }

  const [isSaving, setIsSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSaving(true);
    try {
      await authClient.updateUser({ name: name.trim() });
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setIsChangingPassword(true);
    try {
      await changePassword({
        currentPassword,
        newPassword,
      });
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast.error("Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await authClient.deleteUser();
      toast.success("Account deleted. Goodbye.");
      window.location.replace("/");
    } catch {
      toast.error("Failed to delete account");
      setIsDeleting(false);
    }
  };

  const handleLogout = async () => {
    await signOut({
      fetchOptions: { onSuccess: () => window.location.replace("/") },
    });
  };

  const planLabel = isActive
    ? subscription?.currentPlan ?? "Premium"
    : isFree
      ? "Free"
      : "None";

  return (
    <div className="min-h-screen text-foreground selection:bg-primary selection:text-black">
      <div className="max-w-[1600px] mx-auto px-6 py-12 md:px-20 md:py-24">
        {/* Header */}
        <header className="mb-20 md:mb-32">
          <div className="flex items-center gap-3 text-muted-foreground mb-6">
            <Zap size={18} fill="currentColor" />
            <Typography.S className="font-black uppercase tracking-[0.4em] text-[10px]">
              System Preferences
            </Typography.S>
          </div>
          <Typography.H1 className="text-8xl md:text-[140px] font-black tracking-[-0.06em] leading-[0.75] uppercase italic">
            Config
            <span className="text-muted-foreground/20 not-italic">
              ure
            </span>
          </Typography.H1>
        </header>

        <Tabs
          defaultValue="profile"
          className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12 lg:gap-32"
        >
          {/* Sidebar */}
          <aside className="space-y-12">
            <TabsList className="flex flex-col w-full h-auto bg-transparent gap-2 p-0">
              <SidebarTrigger
                value="profile"
                label="Identity"
                icon={<User size={14} />}
              />
              <SidebarTrigger
                value="security"
                label="Protection"
                icon={<Shield size={14} />}
              />
              <SidebarTrigger
                value="alerts"
                label="Broadcasts"
                icon={<Bell size={14} />}
              />
              <SidebarTrigger
                value="theme"
                label="Interface"
                icon={<Palette size={14} />}
              />
              <SidebarTrigger
                value="plans"
                label="Membership"
                icon={<CreditCard size={14} />}
              />
            </TabsList>

            <div className="pt-12 border-t border-white/5">
              <Typography.S className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.3em] mb-6 block">
                Account Status
              </Typography.S>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-950/50 border border-white/5">
                <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <Typography.S className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Authenticated
                </Typography.S>
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start gap-4 mt-4 text-muted-foreground hover:text-red-500 hover:bg-red-500/5 rounded-xl font-black uppercase tracking-widest text-[9px]"
                onClick={handleLogout}
              >
                <LogOut size={14} /> Terminate
              </Button>
            </div>
          </aside>

          {/* Content */}
          <main className="max-w-3xl">
            {/* Profile Tab */}
            <TabsContent
              value="profile"
              className="m-0 space-y-20 animate-in fade-in slide-in-from-bottom-4 duration-700"
            >
              <section className="space-y-12">
                <ContentHeader
                  title="Identity Registry"
                  subtitle="Core identification parameters"
                />

                <form
                  onSubmit={handleProfileSave}
                  className="space-y-16"
                >
                  <div className="grid gap-10">
                    <InputGroup
                      label="Display Name"
                      value={name}
                      onChange={setName}
                    />
                    <div className="group relative">
                      <Label className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 block mb-2">
                        Registry Email
                      </Label>
                      <p className="w-full py-4 text-2xl font-bold tracking-tight text-muted-foreground border-b-2 border-white/5">
                        {user?.email}
                      </p>
                      <p className="text-[9px] text-muted-foreground/30 font-bold uppercase tracking-widest mt-2">
                        Email changes require
                        verification
                      </p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="h-14 px-12 rounded-full font-black uppercase tracking-[0.2em] text-[10px] bg-white text-black hover:bg-primary transition-all"
                  >
                    {isSaving ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Sync Changes"
                    )}
                  </Button>
                </form>
              </section>

              <section className="pt-20 border-t border-white/5 space-y-8">
                <Typography.S className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">
                  Danger Zone
                </Typography.S>
                <div className="flex flex-wrap gap-4">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="border-red-900/20 text-red-900 rounded-xl text-[10px] font-black uppercase tracking-widest px-8 h-12 hover:bg-red-500 hover:text-white gap-2"
                      >
                        <Trash2 size={14} />
                        Deactivate Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-zinc-950 border-white/10 max-w-md">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="font-black uppercase tracking-tight">
                          Delete your account?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This permanently deletes
                          your account, subscription,
                          favorites, watchlist, and
                          all associated data. This
                          cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl font-black uppercase tracking-widest text-[10px]">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 hover:bg-red-700 rounded-xl font-black uppercase tracking-widest text-[10px]"
                          onClick={
                            handleDeleteAccount
                          }
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            "Delete Forever"
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </section>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent
              value="security"
              className="m-0 space-y-20 animate-in fade-in duration-700"
            >
              <section className="space-y-12">
                <ContentHeader
                  title="Protection"
                  subtitle="Authentication & credential management"
                />

                <form
                  onSubmit={handlePasswordChange}
                  className="space-y-16"
                >
                  <div className="grid gap-10">
                    <InputGroup
                      label="Current Password"
                      value={currentPassword}
                      onChange={setCurrentPassword}
                      type="password"
                    />
                    <InputGroup
                      label="New Password"
                      value={newPassword}
                      onChange={setNewPassword}
                      type="password"
                    />
                    <InputGroup
                      label="Confirm New Password"
                      value={confirmPassword}
                      onChange={setConfirmPassword}
                      type="password"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={
                      isChangingPassword ||
                      !currentPassword ||
                      !newPassword
                    }
                    className="h-14 px-12 rounded-full font-black uppercase tracking-[0.2em] text-[10px] bg-white text-black hover:bg-primary transition-all gap-2"
                  >
                    {isChangingPassword ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <>
                        <KeyRound size={14} /> Update
                        Password
                      </>
                    )}
                  </Button>
                </form>
              </section>

              <section className="pt-20 border-t border-white/5 space-y-8">
                <Typography.S className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">
                  Active Sessions
                </Typography.S>
                <div className="p-6 rounded-2xl bg-zinc-950/50 border border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest">
                          Current Session
                        </p>
                        <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">
                          This device
                        </p>
                      </div>
                    </div>
                    <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">
                      Active now
                    </p>
                  </div>
                </div>
              </section>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent
              value="alerts"
              className="m-0 space-y-12 animate-in fade-in duration-700"
            >
              <ContentHeader
                title="Broadcasts"
                subtitle="Communication preferences"
              />

              <div className="space-y-4">
                <SettingRow
                  title="Email Notifications"
                  desc="Receive updates via email"
                />
                <SettingRow
                  title="New Content Alerts"
                  desc="Get notified when new content is added"
                  defaultChecked
                />
                <SettingRow
                  title="Watchlist Reminders"
                  desc="Reminder for items in your watchlist"
                  defaultChecked
                />
                <SettingRow
                  title="Review Responses"
                  desc="When someone likes your review"
                />
                <SettingRow
                  title="Subscription Updates"
                  desc="Plan changes and billing alerts"
                  defaultChecked
                />
              </div>
            </TabsContent>

            {/* Theme Tab */}
            <TabsContent
              value="theme"
              className="m-0 space-y-12 animate-in fade-in duration-700"
            >
              <ContentHeader
                title="Interface"
                subtitle="Operating environment aesthetics"
              />
              <div className="grid grid-cols-3 gap-8">
                <ThemeCard
                  label="Onyx Dark"
                  active={theme.value === "dark"}
                  onClick={() => theme.set("dark")}
                  preview="bg-zinc-950"
                />
                <ThemeCard
                  label="Pure Light"
                  active={theme.value === "light"}
                  onClick={() => theme.set("light")}
                  preview="bg-white"
                />
                <ThemeCard
                  label="System"
                  active={theme.value === "system"}
                  onClick={() => theme.set("system")}
                  preview="bg-linear-to-r from-zinc-950 to-white"
                />
              </div>
            </TabsContent>

            {/* Membership Tab */}
            <TabsContent
              value="plans"
              className="m-0 space-y-12 animate-in fade-in duration-700"
            >
              <ContentHeader
                title="Membership"
                subtitle="Tier level and billing cycle"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 rounded-[2.5rem] bg-white text-black flex flex-col justify-between aspect-square md:aspect-auto md:h-80">
                  <div>
                    <Typography.S className="font-black uppercase tracking-widest text-[10px] opacity-60 mb-2 block">
                      Active Plan
                    </Typography.S>
                    <Typography.H2 className="text-6xl font-black uppercase tracking-tighter italic">
                      {planLabel}
                      <span className="text-primary">
                        .
                      </span>
                    </Typography.H2>
                  </div>
                  <div className="space-y-4">
                    {isActive && (
                      <>
                        {subscription?.amount && (
                          <p className="text-xs font-bold leading-relaxed">
                            $
                            {(
                              subscription.amount /
                              100
                            ).toFixed(2)}
                            /{subscription.interval}{" "}
                            &middot; Next billing{" "}
                            {subscription.currentPeriodEnd
                              ? new Date(
                                subscription.currentPeriodEnd,
                              ).toLocaleDateString()
                              : "—"}
                          </p>
                        )}
                        <Button
                          className="w-full bg-black text-white rounded-2xl h-12 font-black uppercase tracking-widest text-[10px]"
                          asChild
                        >
                          <Link to="/library/subscription">
                            Manage Billing
                          </Link>
                        </Button>
                      </>
                    )}
                    {isFree && (
                      <Button
                        className="w-full bg-black text-white rounded-2xl h-12 font-black uppercase tracking-widest text-[10px]"
                        asChild
                      >
                        <Link to="/plans">
                          Upgrade Now
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>

                {isFree && (
                  <Link
                    to="/plans"
                    className="p-8 rounded-[2.5rem] bg-zinc-900 border border-white/5 flex flex-col justify-between aspect-square md:aspect-auto md:h-80 group hover:border-primary/50 transition-all cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <Typography.S className="font-black uppercase tracking-widest text-[10px] text-muted-foreground block">
                        Available Upgrade
                      </Typography.S>
                      <ArrowUpRight className="text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                    </div>
                    <div>
                      <Typography.H2 className="text-4xl font-black uppercase tracking-tighter">
                        Premium
                      </Typography.H2>
                      <Typography.P className="text-muted-foreground text-xs mt-2 uppercase font-black tracking-widest">
                        Unlimited streaming + HD
                      </Typography.P>
                    </div>
                  </Link>
                )}
              </div>
            </TabsContent>
          </main>
        </Tabs>
      </div>
    </div>
  );
}

// ─── Atomic UI Components ───────────────────────────────────────────────────

function SidebarTrigger({
  value,
  label,
  icon,
}: { value: string; label: string; icon: React.ReactNode }) {
  return (
    <TabsTrigger
      value={value}
      className={cn(
        "justify-start gap-4 py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-transparent",
        "data-[state=active]:bg-zinc-900 data-[state=active]:text-primary data-[state=active]:border-white/5 text-muted-foreground hover:text-foreground",
      )}
    >
      {icon} {label}
    </TabsTrigger>
  );
}

function ContentHeader({
  title,
  subtitle,
}: { title: string; subtitle: string }) {
  return (
    <div className="space-y-4 mb-12">
      <Typography.H2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter border-none italic">
        {title}
      </Typography.H2>
      <div className="flex items-center gap-4">
        <div className="h-px w-8 bg-primary" />
        <Typography.P className="text-muted-foreground/40 text-[9px] uppercase tracking-[0.3em] font-black">
          {subtitle}
        </Typography.P>
      </div>
    </div>
  );
}

function InputGroup({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="group relative">
      <Label className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 group-focus-within:text-primary transition-colors block mb-2">
        {label}
      </Label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-b-2 border-white/5 py-4 text-2xl font-bold tracking-tight focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/20"
      />
    </div>
  );
}

function SettingRow({
  title,
  desc,
  defaultChecked = false,
}: { title: string; desc: string; defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between py-8 border-b border-white/5 group">
      <div className="space-y-1">
        <Typography.S className="text-xs font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
          {title}
        </Typography.S>
        <Typography.P className="text-[10px] text-muted-foreground/40 uppercase font-black tracking-widest">
          {desc}
        </Typography.P>
      </div>
      <Switch
        className="data-[state=checked]:bg-primary"
        checked={checked}
        onCheckedChange={setChecked}
      />
    </div>
  );
}

function ThemeCard({
  label,
  active = false,
  onClick,
  preview,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
  preview?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "aspect-[4/3] rounded-[2.5rem] border-2 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all hover:scale-[1.02]",
        active
          ? "bg-zinc-900 border-primary"
          : "bg-black border-white/5 grayscale opacity-40 hover:opacity-100 hover:grayscale-0",
      )}
    >
      <div className={cn("size-12 rounded-full", preview ?? "bg-zinc-800")} />
      <Typography.S className="text-[10px] font-black uppercase tracking-widest">
        {label}
      </Typography.S>
    </button>
  );
}
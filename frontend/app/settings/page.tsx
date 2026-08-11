"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
import { AppShell } from "@/src/components/layout/AppShell";
import { useAuth } from "@/src/features/auth/auth.hooks";

const CRUMBS = [{ label: "Dashboard", href: "/" }, { label: "Settings" }];

export default function SettingsPage() {
  const router = useRouter();
  const { user, isLoading, deleteAccount, isDeletingAccount } = useAuth();

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      toast.success("Your account has been deleted.");
      router.push("/welcome");
    } catch (error) {
      toast.error("Couldn't delete your account. Please try again.");
      console.error(error);
    }
  };

  return (
    <AppShell
      crumbs={CRUMBS}
      title="Settings"
      subtitle="Your account and data."
      activeNav="settings"
    >
      <div className="settings-section">
        <h2 className="section-heading">Account</h2>
        {isLoading || !user ? (
          <div className="settings-card">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-56" />
          </div>
        ) : (
          <div className="settings-card">
            <div className="settings-field">
              <span className="settings-field-label">Name</span>
              <span className="settings-field-value">{user.name}</span>
            </div>
            <div className="settings-field">
              <span className="settings-field-label">Email</span>
              <span className="settings-field-value">{user.email}</span>
            </div>
            <div className="settings-field">
              <span className="settings-field-label">Member since</span>
              <span className="settings-field-value">
                {new Date(user.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="settings-section">
        <h2 className="section-heading">Danger zone</h2>
        <div className="settings-card settings-card--danger">
          <div className="settings-danger-copy">
            <p className="settings-danger-title">Delete account</p>
            <p className="settings-danger-body">
              Permanently removes your account, every uploaded resume, and
              every career analysis and roadmap you&apos;ve created. This
              can&apos;t be undone.
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="settings-danger-button"
                disabled={isDeletingAccount}
              >
                Delete account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                <AlertDialogDescription>
                  Your account, every uploaded resume, and every career
                  analysis and roadmap you&apos;ve created will be
                  permanently removed. This can&apos;t be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="dashboard-resume-delete-confirm"
                  onClick={handleDeleteAccount}
                >
                  Delete account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </AppShell>
  );
}

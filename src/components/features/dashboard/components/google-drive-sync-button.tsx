import { Cloud, DownloadCloud, UploadCloud, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGoogleDriveSync } from "../hooks/use-google-drive-sync";

export function GoogleDriveSyncButton() {
  const {
    handleLogin,
    pushToDrive,
    pullFromDrive,
    isSyncing,
    isAuthenticated,
  } = useGoogleDriveSync();

  if (!isAuthenticated) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5 h-8 text-xs bg-indigo-50/50 hover:bg-indigo-100/50 text-indigo-700 dark:bg-indigo-950/20 dark:hover:bg-indigo-900/30 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/40"
        onClick={() => handleLogin()}
        disabled={isSyncing}
      >
        {isSyncing ? (
          <Loader2 className="size-3 animate-spin" />
        ) : (
          <Cloud className="size-3" />
        )}
        Connect Google Drive
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5 h-8 text-xs border-indigo-200 dark:border-indigo-800/40 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
        onClick={pullFromDrive}
        disabled={isSyncing}
      >
        {isSyncing ? (
          <Loader2 className="size-3 animate-spin" />
        ) : (
          <DownloadCloud className="size-3 text-indigo-500" />
        )}
        Pull from Drive
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5 h-8 text-xs border-indigo-200 dark:border-indigo-800/40 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
        onClick={pushToDrive}
        disabled={isSyncing}
      >
        {isSyncing ? (
          <Loader2 className="size-3 animate-spin" />
        ) : (
          <UploadCloud className="size-3 text-indigo-500" />
        )}
        Push to Drive
      </Button>
    </div>
  );
}

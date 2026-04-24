import { useState, useCallback, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { createLocalDataExport, importLocalData } from "@/lib/db/import-export";

const FILE_NAME = "localcv_backup.json";

export function useGoogleDriveSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const fetchNewToken = useCallback(async () => {
    try {
      const res = await fetch("/api/google/refresh");
      if (res.ok) {
        const data = await res.json();
        if (data.access_token) {
          setAccessToken(data.access_token);
          const expiresIn = data.expires_in || 3599;
          localStorage.setItem("localcv_gdrive_token_expires", (Date.now() + expiresIn * 1000).toString());
        }
      }
    } catch (e) {
      console.error("Silent refresh failed", e);
    }
  }, []);

  useEffect(() => {
    const expiresAt = localStorage.getItem("localcv_gdrive_token_expires");
    // If we have an expiration set, check if it's expired or about to expire
    if (expiresAt && Date.now() > parseInt(expiresAt, 10) - 60000) {
      fetchNewToken();
    } else if (!accessToken && expiresAt) {
      fetchNewToken();
    } else if (!expiresAt) {
      // No token ever requested
      fetchNewToken();
    }
  }, [accessToken, fetchNewToken]);

  const handleLogin = useGoogleLogin({
    flow: "auth-code",
    scope: "https://www.googleapis.com/auth/drive.appdata",
    onSuccess: async (codeResponse) => {
      try {
        const res = await fetch("/api/google/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: codeResponse.code }),
        });
        const data = await res.json();
        
        if (res.ok && data.access_token) {
          setAccessToken(data.access_token);
          const expiresIn = data.expires_in || 3599;
          localStorage.setItem("localcv_gdrive_token_expires", (Date.now() + expiresIn * 1000).toString());
          toast.success("Permanently connected to Google Drive!");
        } else {
          toast.error(data.error || "Failed to exchange code.");
        }
      } catch (e) {
        console.error(e);
        toast.error("Network error during auth.");
      }
    },
    onError: (error) => {
      console.error("Login Failed:", error);
      toast.error("Failed to connect to Google Drive.");
    },
  });

  const getBackupFileId = async (token: string): Promise<string | null> => {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name='${FILE_NAME}'`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) throw new Error("Failed to search Drive files");
    const data = await response.json();
    if (data.files && data.files.length > 0) {
      return data.files[0].id;
    }
    return null;
  };

  const pushToDrive = useCallback(async () => {
    if (!accessToken) {
      toast.error("Not connected to Google Drive.");
      return;
    }

    try {
      setIsSyncing(true);
      const payload = await createLocalDataExport();
      const fileContent = JSON.stringify(payload);
      
      const fileId = await getBackupFileId(accessToken);
      
      const metadata = {
        name: FILE_NAME,
        parents: fileId ? undefined : ["appDataFolder"],
      };

      const form = new FormData();
      form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
      form.append("file", new Blob([fileContent], { type: "application/json" }));

      const url = fileId
        ? `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`
        : "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart";

      const method = fileId ? "PATCH" : "POST";

      const uploadResponse = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: form,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload to Drive");
      }

      toast.success("Successfully backed up to Google Drive.");
    } catch (err) {
      console.error(err);
      toast.error("Error backing up to Google Drive.");
    } finally {
      setIsSyncing(false);
    }
  }, [accessToken]);

  const pullFromDrive = useCallback(async () => {
    if (!accessToken) {
      toast.error("Not connected to Google Drive.");
      return;
    }

    try {
      setIsSyncing(true);
      const fileId = await getBackupFileId(accessToken);

      if (!fileId) {
        toast.info("No backup found on Google Drive.");
        return;
      }

      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch backup file.");

      const data = await response.json();
      await importLocalData(data);
      toast.success("Successfully restored from Google Drive.");
    } catch (err) {
      console.error(err);
      toast.error("Error reading from Google Drive.");
    } finally {
      setIsSyncing(false);
    }
  }, [accessToken]);

  return {
    handleLogin,
    pushToDrive,
    pullFromDrive,
    isSyncing,
    isAuthenticated: !!accessToken,
  };
}

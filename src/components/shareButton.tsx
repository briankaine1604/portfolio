"use client";

import { useState } from "react";
import { toast } from "sonner";

export const ShareButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleShare = async () => {
    setIsLoading(true);

    try {
      // Get current page URL
      const url = window.location.href;

      // Copy to clipboard
      await navigator.clipboard.writeText(url);

      // Show success toast
      toast.success("Link copied to clipboard!", {
        description: "You can now share this blog post with others.",
        duration: 3000,
      });
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      try {
        // Create a temporary textarea element
        const textarea = document.createElement("textarea");
        textarea.value = window.location.href;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);

        toast.success("Link copied to clipboard!", {
          description: "You can now share this blog post with others.",
          duration: 3000,
        });
      } catch (fallbackError) {
        toast.error("Failed to copy link", {
          description: "Please copy the URL manually from your browser.",
          duration: 3000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleShare}
      disabled={isLoading}
      className="bg-blue-400 text-black border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] px-4 py-2 font-black uppercase tracking-wide text-xs transform transition-all duration-200 active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? "COPYING..." : "SHARE"}
    </button>
  );
};

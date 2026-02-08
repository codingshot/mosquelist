import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Share2, Mail, MessageCircle } from "lucide-react";
import {
  getTwitterShareUrl,
  getFacebookShareUrl,
  getWhatsAppShareUrl,
  getLinkedInShareUrl,
  getEmailShareUrl,
} from "@/lib/share-urls";
import { toast } from "sonner";

export type ShareContext = "mosque" | "list" | "explore" | "page";

const DEFAULT_ORIGIN = "https://mosquelist.com";

export interface ShareSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Path to share (e.g. /mosque/xyz, /lists/holy-sites). Full URL is built from origin. */
  path: string;
  /** Title for the share (e.g. mosque name, list name) */
  title: string;
  /** Short message for social post (e.g. "Discover Masjid al-Haram in Mecca — MosqueList") */
  shareMessage: string;
  /** Optional context for aria labels */
  context?: ShareContext;
}

export function ShareSheet({
  open,
  onOpenChange,
  path,
  title,
  shareMessage,
  context = "page",
}: ShareSheetProps) {
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}${path.startsWith("/") ? path : `/${path}`}`
      : `${DEFAULT_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
      onOpenChange(false);
    } catch {
      toast.error("Could not copy link");
    }
  };

  const contextLabel =
    context === "mosque"
      ? "mosque"
      : context === "list"
        ? "list"
        : context === "explore"
          ? "explore"
          : "page";

  const twitterUrl = getTwitterShareUrl(shareMessage, url);
  const facebookUrl = getFacebookShareUrl(url);
  const whatsappUrl = getWhatsAppShareUrl(shareMessage, url);
  const linkedInUrl = getLinkedInShareUrl(url);
  const emailUrl = getEmailShareUrl(
    `${title} | MosqueList`,
    `${shareMessage}\n\n${url}`
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            Share {contextLabel}
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">{shareMessage}</p>
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start gap-2 min-h-[44px] touch-manipulation"
            onClick={handleCopyLink}
          >
            <Copy className="h-4 w-4" />
            Copy link
          </Button>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="min-h-[44px] touch-manipulation"
              asChild
            >
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on X (Twitter)"
              >
                X
              </a>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="min-h-[44px] touch-manipulation"
              asChild
            >
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Facebook"
              >
                Facebook
              </a>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="min-h-[44px] touch-manipulation gap-1.5"
              asChild
            >
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on WhatsApp"
              >
                <MessageCircle className="h-4 w-4 shrink-0" />
                WhatsApp
              </a>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="min-h-[44px] touch-manipulation"
              asChild
            >
              <a
                href={linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on LinkedIn"
              >
                LinkedIn
              </a>
            </Button>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2 min-h-[44px] touch-manipulation"
            asChild
          >
            <a href={emailUrl} aria-label="Share by email">
              <Mail className="h-4 w-4" />
              Email
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

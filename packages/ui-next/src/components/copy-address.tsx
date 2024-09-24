import { cn } from "@/utils";
import { formatAddress, FormatAddressOptions } from "@cartridge/utils";
import { CopyIcon } from "./icons";
import { toast } from "sonner";
import { useCallback } from "react";

export function CopyAddress({
  address,
  className,
  first = 15,
  last = 15,
}: { address: string; className?: string } & FormatAddressOptions) {
  const onCopy = useCallback(() => {
    navigator.clipboard.writeText(formatAddress(address, { padding: true }));
    toast.success("Address copied");
  }, [address]);

  return (
    <>
      <div
        className={cn(
          "text-xs text-muted-foreground flex items-center gap-1 cursor-pointer",
          className,
        )}
        onClick={onCopy}
      >
        {formatAddress(address, { first, last })}

        <CopyIcon size="sm" />
      </div>
    </>
  );
}

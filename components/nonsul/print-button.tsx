"use client";

import { Button } from "@/components/ui/button";
import { PrinterIcon } from "@phosphor-icons/react";

export function PrintButton() {
  return (
    <Button
      type="button"
      variant="outline"
      className="print:hidden"
      onClick={() => window.print()}
    >
      <PrinterIcon data-icon="inline-start" />
      인쇄
    </Button>
  );
}

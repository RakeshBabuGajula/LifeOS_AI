"use client";
import { useReactToPrint } from "react-to-print";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

interface PDFExportButtonProps {
    contentRef: React.RefObject<HTMLDivElement | null>;
    filename?: string;
}

export function PDFExportButton({ contentRef, filename = "LifeOS_Report" }: PDFExportButtonProps) {
    const handlePrint = useReactToPrint({
        contentRef: contentRef,
        documentTitle: filename,
    });

    return (
        <Button
            onClick={() => handlePrint && handlePrint()}
            variant="outline"
            className="flex items-center gap-2 border-primary/20 hover:bg-primary/5 text-primary"
        >
            <Printer className="w-4 h-4" /> Export PDF
        </Button>
    );
}

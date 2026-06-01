import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }) {
  let colorClass = "bg-muted text-muted-foreground";
  
  const s = status ? status.toLowerCase() : "unknown";
  if (s === "ready") {
    colorClass = "bg-[#16A34A]/10 text-[#16A34A] hover:bg-[#16A34A]/20 border-0";
  } else if (s === "processing" || s === "uploading") {
    colorClass = "bg-[#D97706]/10 text-[#D97706] hover:bg-[#D97706]/20 border-0";
  } else if (s === "failed" || s === "error") {
    colorClass = "bg-[#DC2626]/10 text-[#DC2626] hover:bg-[#DC2626]/20 border-0";
  }

  return (
    <Badge className={`px-2.5 py-0.5 font-medium ${colorClass}`}>
      {status}
    </Badge>
  );
}

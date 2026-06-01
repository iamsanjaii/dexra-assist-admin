import { FileQuestion } from "lucide-react";

export function EmptyState({ title, description, icon: Icon = FileQuestion, action }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-lg border border-dashed bg-card">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
        <Icon className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

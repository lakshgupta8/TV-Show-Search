import type { FC, ReactNode } from "react";

interface StatusMessageProps {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
}

const StatusMessage: FC<StatusMessageProps> = ({ title, description, action }) => (
  <div className="flex flex-col items-center gap-3 py-16 text-center animate-fade-in">
    <div className="bg-accent-bg/60 mb-2 rounded-full w-16 h-1" />
    <h2 className="font-bold text-text-primary text-xl">{title}</h2>
    {description && <p className="max-w-md text-text-muted">{description}</p>}
    {action && <div className="mt-3">{action}</div>}
  </div>
);

export default StatusMessage;

export const buttonClass =
  "inline-flex items-center gap-2 bg-accent-bg hover:bg-accent-border px-4 py-2 border border-accent-border rounded-lg font-semibold text-accent-text text-sm transition-colors cursor-pointer";

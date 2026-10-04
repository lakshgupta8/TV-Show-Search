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

export const secondaryButtonClass =
  "inline-flex items-center gap-2 bg-surface-raised hover:bg-surface-hover px-4 py-2 border border-border-hover rounded-lg font-semibold text-text-secondary text-sm transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";

export const ErrorMessage: FC<{ error?: string; onRetry: () => void; title?: string }> = ({
  error,
  onRetry,
  title = "Couldn't load this",
}) => (
  <StatusMessage
    title={title}
    description={error}
    action={
      <button type="button" className={buttonClass} onClick={onRetry}>
        Try again
      </button>
    }
  />
);

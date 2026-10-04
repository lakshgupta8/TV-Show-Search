import type { FC } from "react";
import { Link } from "react-router-dom";
import { buttonClass } from "../components/StatusMessage";

const NotFoundPage: FC = () => (
  <div className="flex flex-col items-center gap-4 mx-auto px-4 py-24 max-w-6xl text-center animate-fade-in">
    <p className="font-black text-brand text-7xl tracking-tighter">404</p>
    <h1 className="font-bold text-text-primary text-2xl">Nothing on this channel</h1>
    <p className="max-w-md text-text-muted">
      The show or page you're looking for doesn't exist, or it may have been removed.
    </p>
    <Link to="/" className={`${buttonClass} mt-2`}>
      Back to search
    </Link>
  </div>
);

export default NotFoundPage;

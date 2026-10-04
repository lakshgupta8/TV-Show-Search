import type { FC } from "react";
import { BsArrowLeft, BsBoxArrowUpRight } from "react-icons/bs";
import { NavLink, Outlet, useNavigate, useLocation, useOutletContext, useParams } from "react-router-dom";
import GenrePill from "../../components/GenrePill";
import Poster from "../../components/Poster";
import RatingBadge from "../../components/RatingBadge";
import { HeroSkeleton } from "../../components/Skeletons";
import { ErrorMessage, secondaryButtonClass } from "../../components/StatusMessage";
import { useQuery } from "../../store/useQuery";
import type { ShowDetails } from "../../types";
import { channelName, yearRange } from "../../utils";
import NotFoundPage from "../NotFoundPage";

export const useShowDetails = () => useOutletContext<ShowDetails>();

export const BackButton: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // "default" means this page was opened directly, so there is no in-app history to go back to.
  const goBack = () => (location.key !== "default" ? navigate(-1) : navigate("/"));
  return (
    <button type="button" onClick={goBack} className={`${secondaryButtonClass} bg-surface-raised/80 mb-8`}>
      <BsArrowLeft /> Back
    </button>
  );
};

export const Backdrop: FC<{ src?: string }> = ({ src }) =>
  src ? (
    <div aria-hidden className="-z-10 absolute inset-x-0 top-0 h-120 overflow-hidden">
      <img src={src} alt="" className="opacity-25 blur-2xl w-full h-full object-cover scale-110" />
      <div className="absolute inset-0 bg-linear-to-b from-surface-base/30 via-surface-base/80 to-surface-base" />
    </div>
  ) : null;

const ShowLayout: FC = () => {
  const id = Number(useParams().showId);
  const isValidId = Number.isInteger(id) && id > 0;
  const query = useQuery("showDetails", isValidId ? id : null);

  if (!isValidId || query.notFound) return <NotFoundPage />;

  const details = query.data;
  const background =
    details?.images.find((image) => image.type === "background" && image.main) ??
    details?.images.find((image) => image.type === "background");

  return (
    <div className="isolate relative">
      <Backdrop src={background?.resolutions.original.url ?? details?.show.image?.original} />
      <div className="mx-auto px-4 pt-6 max-w-6xl">
        <BackButton />
        {details ? (
          <>
            <ShowHero details={details} />
            <ShowTabs details={details} />
            <Outlet context={details} />
          </>
        ) : query.status === "failed" ? (
          <ErrorMessage title="Couldn't load this show" error={query.error} onRetry={query.refetch} />
        ) : (
          <HeroSkeleton />
        )}
      </div>
    </div>
  );
};

const ShowHero: FC<{ details: ShowDetails }> = ({ details: { show } }) => {
  const runtime = show.runtime ?? show.averageRuntime;
  const meta = [yearRange(show), runtime && `${runtime} min`, channelName(show), show.language]
    .filter(Boolean)
    .join(" · ");
  const isRunning = show.status === "Running";

  return (
    <div className="flex md:flex-row flex-col gap-8 md:gap-12 animate-fade-in">
      <Poster
        src={show.image?.original ?? show.image?.medium}
        alt={show.name}
        loading="eager"
        className="shadow-2xl shadow-accent-bg/50 mx-auto md:mx-0 border border-border-base rounded-xl w-56 md:w-64 aspect-2/3 shrink-0"
      />
      <div className="flex flex-col justify-center gap-5 min-w-0">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`px-2.5 py-0.5 border rounded-full font-semibold text-xs uppercase tracking-wider ${
                isRunning
                  ? "bg-accent-bg/60 border-accent-border text-accent-text"
                  : "bg-surface-raised border-border-active text-text-muted"
              }`}
            >
              {show.status}
            </span>
            {meta && <span className="text-text-muted text-sm">{meta}</span>}
          </div>
          <h1 className="font-extrabold text-text-primary text-4xl md:text-5xl tracking-tight">{show.name}</h1>
          {show.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {show.genres.map((genre) => (
                <GenrePill key={genre} name={genre} />
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <RatingBadge value={show.rating.average} size="lg" />
          {show.officialSite && (
            <a href={show.officialSite} target="_blank" rel="noreferrer" className={secondaryButtonClass}>
              Official site <BsBoxArrowUpRight className="text-xs" />
            </a>
          )}
          {show.externals.imdb && (
            <a
              href={`https://www.imdb.com/title/${show.externals.imdb}/`}
              target="_blank"
              rel="noreferrer"
              className={secondaryButtonClass}
            >
              IMDb <BsBoxArrowUpRight className="text-xs" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const ShowTabs: FC<{ details: ShowDetails }> = ({ details }) => {
  const tabs = [
    { to: "", label: "Overview" },
    { to: "episodes", label: "Episodes", count: details.episodes.length },
    { to: "cast", label: "Cast & Crew", count: details.cast.length + details.crew.length },
    { to: "gallery", label: "Gallery", count: details.images.length },
  ];

  return (
    <nav className="flex gap-1 mt-10 mb-8 border-b border-border-base overflow-x-auto custom-scrollbar-x">
      {tabs.map((tab) => (
        <NavLink
          key={tab.label}
          to={tab.to}
          end
          replace
          className={({ isActive }) =>
            `-mb-px px-4 py-2.5 border-b-2 font-semibold text-sm whitespace-nowrap transition-colors ${
              isActive ? "border-brand text-text-primary" : "border-transparent text-text-muted hover:text-text-primary"
            }`
          }
        >
          {tab.label}
          {!!tab.count && (
            <span className="bg-surface-raised ml-2 px-1.5 py-0.5 rounded font-medium text-text-muted text-xs">{tab.count}</span>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default ShowLayout;

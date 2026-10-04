import parse from "html-react-parser";
import { useEffect, type FC, type ReactNode } from "react";
import { BsArrowLeft, BsBoxArrowUpRight } from "react-icons/bs";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CastStack from "../components/CastStack";
import GenrePill from "../components/GenrePill";
import Poster from "../components/Poster";
import RatingBadge from "../components/RatingBadge";
import SeasonList from "../components/SeasonList";
import { ShowDetailsSkeleton } from "../components/Skeletons";
import StatusMessage, { buttonClass } from "../components/StatusMessage";
import { useAppDispatch, useAppSelector } from "../store";
import { selectDetailEntry, selectShowById } from "../store/selectors";
import { detailRequested, type DetailEntry } from "../store/showsSlice";
import type { Show } from "../types";
import { channelName, yearRange } from "../utils";
import NotFoundPage from "./NotFoundPage";

const ShowPage: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const id = Number(useParams().showId);
  const isValidId = Number.isInteger(id) && id > 0;

  // A show reached from search results is already in the store and renders immediately;
  // cast and seasons arrive with the detail request.
  const show = useAppSelector((state) => selectShowById(state, id));
  const detail = useAppSelector((state) => selectDetailEntry(state, id));

  useEffect(() => {
    if (isValidId) dispatch(detailRequested(id));
  }, [id, isValidId, dispatch]);

  if (!isValidId || detail?.notFound) return <NotFoundPage />;

  const retry = () => dispatch(detailRequested(id));
  // "default" means this page was opened directly, so there is no in-app history to go back to.
  const goBack = () => (location.key !== "default" ? navigate(-1) : navigate("/"));

  let body: ReactNode;
  if (show) {
    body = <ShowDetails show={show} detail={detail} onRetry={retry} />;
  } else if (detail?.status === "failed") {
    body = (
      <StatusMessage
        title="Couldn't load this show"
        description={detail.error}
        action={
          <button type="button" className={buttonClass} onClick={retry}>
            Try again
          </button>
        }
      />
    );
  } else {
    body = <ShowDetailsSkeleton />;
  }

  return (
    <div className="isolate relative">
      {show?.image?.original && (
        <div aria-hidden className="-z-10 absolute inset-x-0 top-0 h-120 overflow-hidden">
          <img src={show.image.original} alt="" className="opacity-25 blur-2xl w-full h-full object-cover scale-110" />
          <div className="absolute inset-0 bg-linear-to-b from-surface-base/30 via-surface-base/80 to-surface-base" />
        </div>
      )}

      <div className="mx-auto px-4 pt-6 max-w-6xl">
        <button
          type="button"
          onClick={goBack}
          className="inline-flex items-center gap-2 bg-surface-raised/80 hover:bg-surface-hover mb-8 px-4 py-2 border border-border-hover rounded-lg font-semibold text-text-secondary text-sm transition-colors cursor-pointer"
        >
          <BsArrowLeft /> Back
        </button>
        {body}
      </div>
    </div>
  );
};

interface ShowDetailsProps {
  show: Show;
  detail?: DetailEntry;
  onRetry: () => void;
}

const ShowDetails: FC<ShowDetailsProps> = ({ show, detail, onRetry }) => {
  const runtime = show.runtime ?? show.averageRuntime;
  const meta = [yearRange(show), runtime && `${runtime} min`, channelName(show), show.language]
    .filter(Boolean)
    .join(" · ");
  const isRunning = show.status === "Running";
  const schedule =
    isRunning && show.schedule.days.length > 0
      ? `Airs ${show.schedule.days.join(", ")}${show.schedule.time ? ` at ${show.schedule.time}` : ""}`
      : null;

  const renderExtras = (render: (detail: DetailEntry) => ReactNode) => {
    if (!detail || detail.status === "loading")
      return <div className="bg-surface-raised rounded-xl w-full max-w-sm h-14 animate-pulse" />;
    if (detail.status === "failed")
      return (
        <p className="text-text-muted text-sm">
          Couldn't load this section.{" "}
          <button type="button" onClick={onRetry} className="text-accent-text underline underline-offset-4 cursor-pointer">
            Retry
          </button>
        </p>
      );
    return render(detail);
  };

  return (
    <article className="space-y-14 animate-fade-in">
      <div className="flex md:flex-row flex-col gap-8 md:gap-12">
        <Poster
          src={show.image?.original ?? show.image?.medium}
          alt={show.name}
          loading="eager"
          className="shadow-2xl shadow-accent-bg/50 mx-auto md:mx-0 border border-border-base rounded-xl w-56 md:w-72 aspect-2/3 shrink-0"
        />

        <div className="flex flex-col flex-1 gap-6 min-w-0">
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

          <div className="flex flex-wrap items-center gap-4">
            <RatingBadge value={show.rating.average} size="lg" />
            {show.officialSite && (
              <a
                href={show.officialSite}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-surface-raised hover:bg-surface-hover px-4 py-2 border border-border-hover rounded-lg font-semibold text-text-secondary text-sm transition-colors"
              >
                Official site <BsBoxArrowUpRight className="text-xs" />
              </a>
            )}
            {schedule && <span className="text-text-muted text-sm">{schedule}</span>}
          </div>

          <div className="max-w-3xl text-text-secondary text-lg leading-relaxed [&_p+p]:mt-4">
            {show.summary ? parse(show.summary) : <p className="text-text-muted">No summary available.</p>}
          </div>

          <section className="space-y-3">
            <h2 className="font-semibold text-text-muted text-xs tracking-widest">
              CAST{detail?.status === "succeeded" && detail.cast.length > 0 && ` (${detail.cast.length})`}
            </h2>
            {renderExtras((d) => <CastStack cast={d.cast} />)}
          </section>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="font-bold text-text-primary text-2xl tracking-tight">
          Seasons
          {detail?.status === "succeeded" && detail.seasons.length > 0 && (
            <span className="ml-2 font-medium text-text-muted text-base">{detail.seasons.length}</span>
          )}
        </h2>
        {renderExtras((d) => <SeasonList seasons={d.seasons} />)}
      </section>
    </article>
  );
};

export default ShowPage;

import parse from "html-react-parser";
import { useMemo, type FC } from "react";
import { BsChevronLeft, BsChevronRight, BsFilm } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import Poster from "../components/Poster";
import RatingBadge from "../components/RatingBadge";
import { SectionHeading } from "../components/Rail";
import { HeroSkeleton } from "../components/Skeletons";
import { ErrorMessage } from "../components/StatusMessage";
import { useQuery } from "../store/useQuery";
import type { Episode, EpisodeDetails } from "../types";
import { channelName, episodeCode, formatDate } from "../utils";
import NotFoundPage from "./NotFoundPage";
import { BackButton, Backdrop } from "./show/ShowLayout";
import { CastGrid, CrewList } from "./show/ShowCast";

const EpisodeNavLink: FC<{ episode: Episode; direction: "previous" | "next" }> = ({ episode, direction }) => (
  <Link
    to={`/episode/${episode.id}`}
    replace
    className={`group flex items-center gap-3 bg-surface p-4 border border-border-base hover:border-accent-border rounded-xl transition-colors ${
      direction === "next" ? "sm:flex-row-reverse sm:text-right" : ""
    }`}
  >
    {direction === "previous" ? (
      <BsChevronLeft className="text-text-muted group-hover:text-accent-text shrink-0" />
    ) : (
      <BsChevronRight className="text-text-muted group-hover:text-accent-text shrink-0" />
    )}
    <div className="min-w-0">
      <p className="font-semibold text-text-muted text-xs uppercase tracking-widest">
        {direction === "previous" ? "Previous" : "Next"} · {episodeCode(episode)}
      </p>
      <p className="font-bold text-text-primary group-hover:text-accent-text truncate transition-colors">{episode.name}</p>
    </div>
  </Link>
);

const EpisodeContent: FC<{ details: EpisodeDetails }> = ({ details: { episode, show, guestCast, guestCrew } }) => {
  // The show's episode list (usually cached from the show page) gives us previous/next links.
  const showQuery = useQuery("showDetails", show.id);
  const [previous, next] = useMemo(() => {
    const list = showQuery.data?.episodes ?? [];
    const index = list.findIndex((e) => e.id === episode.id);
    return index === -1 ? [undefined, undefined] : [list[index - 1], list[index + 1]];
  }, [showQuery.data, episode.id]);

  const meta = [
    formatDate(episode.airdate, "long"),
    episode.airtime,
    episode.runtime && `${episode.runtime} min`,
    channelName(show),
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="space-y-12 animate-fade-in">
      <div className="gap-8 lg:gap-12 grid lg:grid-cols-[1.2fr_1fr]">
        <div className="bg-surface-raised shadow-2xl shadow-accent-bg/40 border border-border-base rounded-xl aspect-video overflow-hidden">
          <Poster
            src={episode.image?.original ?? episode.image?.medium}
            alt={episode.name}
            icon={BsFilm}
            loading="eager"
            className="w-full h-full"
          />
        </div>
        <div className="flex flex-col justify-center gap-4 min-w-0">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm">
            <Link to={`/show/${show.id}`} className="font-semibold text-accent-text/90 hover:text-accent-text">
              {show.name}
            </Link>
            <span className="text-text-muted">/</span>
            <Link to={`/show/${show.id}/episodes?season=${episode.season}`} className="text-text-muted hover:text-text-primary">
              Season {episode.season}
            </Link>
          </nav>
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-accent-bg px-2.5 py-0.5 border border-accent-border rounded-md font-mono font-bold text-accent-text text-sm">
              {episodeCode(episode)}
            </span>
            {episode.type !== "regular" && (
              <span className="bg-surface-raised px-2.5 py-0.5 border border-border-active rounded-full text-text-muted text-xs uppercase tracking-wider">
                {episode.type.replace(/_/g, " ")}
              </span>
            )}
            <RatingBadge value={episode.rating.average} />
          </div>
          <h1 className="font-extrabold text-text-primary text-3xl md:text-4xl tracking-tight">{episode.name}</h1>
          {meta && <p className="text-text-muted text-sm">{meta}</p>}
          <div className="text-text-secondary leading-relaxed [&_p+p]:mt-3">
            {episode.summary ? parse(episode.summary) : <p className="text-text-muted">No summary available yet.</p>}
          </div>
        </div>
      </div>

      {(previous || next) && (
        <div className="gap-4 grid sm:grid-cols-2">
          <div>{previous && <EpisodeNavLink episode={previous} direction="previous" />}</div>
          <div>{next && <EpisodeNavLink episode={next} direction="next" />}</div>
        </div>
      )}

      {guestCast.length > 0 && (
        <section>
          <SectionHeading title="Guest stars" subtitle={`${guestCast.length} guest appearances in this episode`} />
          <CastGrid cast={guestCast} />
        </section>
      )}

      {guestCrew.length > 0 && (
        <section>
          <SectionHeading title="Episode crew" />
          <CrewList crew={guestCrew} />
        </section>
      )}
    </article>
  );
};

const EpisodePage: FC = () => {
  const id = Number(useParams().episodeId);
  const isValidId = Number.isInteger(id) && id > 0;
  const query = useQuery("episodeDetails", isValidId ? id : null);

  if (!isValidId || query.notFound) return <NotFoundPage />;

  return (
    <div className="isolate relative">
      <Backdrop src={query.data?.episode.image?.original ?? query.data?.show.image?.original} />
      <div className="mx-auto px-4 pt-6 max-w-6xl">
        <BackButton />
        {query.data ? (
          <EpisodeContent key={id} details={query.data} />
        ) : query.status === "failed" ? (
          <ErrorMessage title="Couldn't load this episode" error={query.error} onRetry={query.refetch} />
        ) : (
          <HeroSkeleton />
        )}
      </div>
    </div>
  );
};

export default EpisodePage;

import parse from "html-react-parser";
import type { FC, ReactNode } from "react";
import { BsArrowRight } from "react-icons/bs";
import { Link } from "react-router-dom";
import CastStack from "../../components/CastStack";
import Poster from "../../components/Poster";
import type { Episode } from "../../types";
import { episodeCode, formatDate, relativeDay, yearRange } from "../../utils";
import { useShowDetails } from "./ShowLayout";

const EpisodeTeaser: FC<{ label: string; episode: Episode }> = ({ label, episode }) => {
  const when = episode.airdate && (relativeDay(episode.airdate) ?? formatDate(episode.airdate, "long"));
  return (
    <Link
      to={`/episode/${episode.id}`}
      className="group block bg-surface p-4 border border-border-base hover:border-accent-border rounded-xl transition-colors"
    >
      <p className="font-semibold text-brand text-xs uppercase tracking-widest">{label}</p>
      <p className="mt-2 font-bold text-text-primary group-hover:text-accent-text transition-colors">{episode.name}</p>
      <p className="mt-1 text-text-muted text-sm">
        <span className="font-mono">{episodeCode(episode)}</span>
        {when && ` · ${when}`}
        {episode.airtime && ` at ${episode.airtime}`}
      </p>
    </Link>
  );
};

const InfoRow: FC<{ label: string; children: ReactNode }> = ({ label, children }) => (
  <div className="flex justify-between gap-4 py-2.5 border-b border-border-base last:border-0 text-sm">
    <dt className="text-text-muted shrink-0">{label}</dt>
    <dd className="text-text-primary text-right">{children}</dd>
  </div>
);

const ShowOverview: FC = () => {
  const { show, cast, seasons, akas, nextEpisode, previousEpisode } = useShowDetails();
  const channel = show.network ?? show.webChannel;
  const runtime = show.runtime ?? show.averageRuntime;
  const schedule = show.schedule.days.length
    ? `${show.schedule.days.join(", ")}${show.schedule.time ? ` at ${show.schedule.time}` : ""}`
    : null;
  const uniqueAkas = [...new Map(akas.map((aka) => [aka.name, aka])).values()];

  return (
    <div className="gap-10 grid lg:grid-cols-[1fr_20rem] animate-fade-in">
      <div className="space-y-10 min-w-0">
        <div className="max-w-3xl text-text-secondary text-lg leading-relaxed [&_p+p]:mt-4">
          {show.summary ? parse(show.summary) : <p className="text-text-muted">No summary available.</p>}
        </div>

        {(nextEpisode || previousEpisode) && (
          <div className="gap-4 grid sm:grid-cols-2">
            {nextEpisode && <EpisodeTeaser label="Next episode" episode={nextEpisode} />}
            {previousEpisode && <EpisodeTeaser label="Latest episode" episode={previousEpisode} />}
          </div>
        )}

        <section className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-text-muted text-xs tracking-widest">STARRING</h2>
            {cast.length > 0 && (
              <Link to="cast" replace className="inline-flex items-center gap-1.5 font-semibold text-accent-text/80 hover:text-accent-text text-sm">
                Full cast & crew <BsArrowRight />
              </Link>
            )}
          </div>
          <CastStack cast={cast} max={8} />
        </section>

        <section className="space-y-4">
          <h2 className="font-bold text-text-primary text-2xl tracking-tight">
            Seasons <span className="font-medium text-text-muted text-base">{seasons.length}</span>
          </h2>
          {seasons.length === 0 ? (
            <p className="text-text-muted text-sm">No season information available.</p>
          ) : (
            <ul className="gap-3 grid grid-cols-1 sm:grid-cols-2">
              {seasons.map((season) => {
                const years = yearRange({ premiered: season.premiereDate, ended: season.endDate, status: "" });
                return (
                  <li key={season.id}>
                    <Link
                      to={`episodes?season=${season.number}`}
                      replace
                      className="group flex items-center gap-4 bg-surface p-3 border border-border-base hover:border-accent-border rounded-xl transition-colors"
                    >
                      <div className="bg-surface-raised rounded-md w-12 aspect-2/3 overflow-hidden shrink-0">
                        <Poster src={season.image?.medium ?? show.image?.medium} alt={`Season ${season.number}`} className="w-full h-full" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-text-primary group-hover:text-accent-text truncate transition-colors">
                          {season.name || `Season ${season.number}`}
                        </p>
                        <p className="text-text-muted text-xs">
                          {[season.name && `Season ${season.number}`, season.episodeOrder && `${season.episodeOrder} episodes`, years]
                            .filter(Boolean)
                            .join(" · ") || "Dates TBA"}
                        </p>
                      </div>
                      <BsArrowRight className="ml-auto text-text-muted group-hover:text-accent-text transition-colors shrink-0" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      <aside className="space-y-6">
        <div className="bg-surface p-5 border border-border-base rounded-xl">
          <h2 className="mb-2 font-semibold text-text-muted text-xs tracking-widest">SHOW INFO</h2>
          <dl>
            {channel && (
              <InfoRow label={show.network ? "Network" : "Streaming on"}>
                {channel.name}
                {channel.country && <span className="text-text-muted"> ({channel.country.code})</span>}
              </InfoRow>
            )}
            {schedule && <InfoRow label="Schedule">{schedule}</InfoRow>}
            <InfoRow label="Status">{show.status}</InfoRow>
            <InfoRow label="Type">{show.type}</InfoRow>
            {show.premiered && <InfoRow label="Premiered">{formatDate(show.premiered)}</InfoRow>}
            {show.ended && <InfoRow label="Ended">{formatDate(show.ended)}</InfoRow>}
            {runtime && <InfoRow label="Runtime">{runtime} min</InfoRow>}
            {show.language && <InfoRow label="Language">{show.language}</InfoRow>}
          </dl>
        </div>

        {uniqueAkas.length > 0 && (
          <div className="bg-surface p-5 border border-border-base rounded-xl">
            <h2 className="mb-3 font-semibold text-text-muted text-xs tracking-widest">ALSO KNOWN AS</h2>
            <ul className="space-y-2 pr-1 max-h-72 overflow-y-auto custom-scrollbar">
              {uniqueAkas.map((aka) => (
                <li key={aka.name} className="flex justify-between gap-3 text-sm">
                  <span className="text-text-primary">{aka.name}</span>
                  {aka.country && <span className="text-text-muted text-xs shrink-0">{aka.country.name}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>
    </div>
  );
};

export default ShowOverview;

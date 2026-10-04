import { useMemo, useState, type FC } from "react";
import { BsPersonFill } from "react-icons/bs";
import { useParams } from "react-router-dom";
import Poster from "../components/Poster";
import { SectionHeading } from "../components/Rail";
import ShowCard from "../components/ShowCard";
import { HeroSkeleton } from "../components/Skeletons";
import { ErrorMessage } from "../components/StatusMessage";
import { useQuery } from "../store/useQuery";
import type { PersonDetails, Show } from "../types";
import { age, byRating, formatDate, groupBy } from "../utils";
import NotFoundPage from "./NotFoundPage";
import { BackButton, Backdrop } from "./show/ShowLayout";
import { characterLabel } from "./show/ShowCast";

const SORTS = {
  newest: (a: Show, b: Show) => (b.premiered ?? "").localeCompare(a.premiered ?? ""),
  rating: byRating,
};

const gridClass = "gap-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6";

const Fact: FC<{ label: string; value: string | null | undefined }> = ({ label, value }) =>
  value ? (
    <div>
      <dt className="font-semibold text-text-muted text-xs uppercase tracking-widest">{label}</dt>
      <dd className="mt-1 text-text-primary">{value}</dd>
    </div>
  ) : null;

const PersonContent: FC<{ details: PersonDetails }> = ({ details: { person, castCredits, crewCredits } }) => {
  const [sort, setSort] = useState<keyof typeof SORTS>("newest");

  // A person can play several characters in one show; show each show once.
  const acting = useMemo(
    () =>
      groupBy(castCredits, (credit) => String(credit.show.id))
        .map(([, credits]) => ({ show: credits[0].show, label: credits.map(characterLabel).join(", ") }))
        .sort((a, b) => SORTS[sort](a.show, b.show)),
    [castCredits, sort]
  );
  const crew = useMemo(
    () =>
      groupBy(crewCredits, (credit) => String(credit.show.id))
        .map(([, credits]) => ({ show: credits[0].show, label: [...new Set(credits.map((c) => c.type))].join(", ") }))
        .sort((a, b) => SORTS[sort](a.show, b.show)),
    [crewCredits, sort]
  );

  const born = person.birthday
    ? `${formatDate(person.birthday, "long")}${person.deathday ? "" : ` (age ${age(person.birthday)})`}`
    : null;
  const died = person.deathday
    ? `${formatDate(person.deathday, "long")}${person.birthday ? ` (aged ${age(person.birthday, person.deathday)})` : ""}`
    : null;

  return (
    <article className="space-y-12 animate-fade-in">
      <div className="flex sm:flex-row flex-col gap-8 md:gap-12">
        <Poster
          src={person.image?.original ?? person.image?.medium}
          alt={person.name}
          icon={BsPersonFill}
          loading="eager"
          className="shadow-2xl shadow-accent-bg/50 mx-auto sm:mx-0 border border-border-base rounded-xl w-48 md:w-60 aspect-3/4 shrink-0"
        />
        <div className="flex flex-col justify-center gap-6">
          <div>
            <h1 className="font-extrabold text-text-primary text-4xl md:text-5xl tracking-tight">{person.name}</h1>
            <p className="mt-2 text-text-muted">
              {castCredits.length} acting {castCredits.length === 1 ? "credit" : "credits"} · {crewCredits.length} crew{" "}
              {crewCredits.length === 1 ? "credit" : "credits"}
            </p>
          </div>
          <dl className="gap-x-10 gap-y-4 grid grid-cols-2 max-w-lg">
            <Fact label="Born" value={born} />
            <Fact label="Died" value={died} />
            <Fact label="From" value={person.country?.name} />
            <Fact label="Gender" value={person.gender} />
          </dl>
        </div>
      </div>

      {(acting.length > 0 || crew.length > 0) && (
        <div className="flex justify-end items-center gap-2 -mb-6 text-sm">
          <span className="text-text-muted">Sort</span>
          {(["newest", "rating"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setSort(key)}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                sort === key ? "bg-accent-bg text-accent-text" : "text-text-muted hover:text-text-primary"
              }`}
            >
              {key === "newest" ? "Newest" : "Top rated"}
            </button>
          ))}
        </div>
      )}

      {acting.length > 0 && (
        <section>
          <SectionHeading title="Acting" subtitle={`${acting.length} shows`} />
          <div className={gridClass}>
            {acting.map(({ show, label }) => (
              <ShowCard key={show.id} show={show} subtitle={label} compact />
            ))}
          </div>
        </section>
      )}

      {crew.length > 0 && (
        <section>
          <SectionHeading title="Behind the camera" subtitle={`${crew.length} shows`} />
          <div className={gridClass}>
            {crew.map(({ show, label }) => (
              <ShowCard key={show.id} show={show} subtitle={label} compact />
            ))}
          </div>
        </section>
      )}
    </article>
  );
};

const PersonPage: FC = () => {
  const id = Number(useParams().personId);
  const isValidId = Number.isInteger(id) && id > 0;
  const query = useQuery("personDetails", isValidId ? id : null);

  if (!isValidId || query.notFound) return <NotFoundPage />;

  const backdrop = query.data?.castCredits.find((credit) => credit.show.image)?.show.image?.original;

  return (
    <div className="isolate relative">
      <Backdrop src={backdrop} />
      <div className="mx-auto px-4 pt-6 max-w-6xl">
        <BackButton />
        {query.data ? (
          <PersonContent details={query.data} />
        ) : query.status === "failed" ? (
          <ErrorMessage title="Couldn't load this person" error={query.error} onRetry={query.refetch} />
        ) : (
          <HeroSkeleton />
        )}
      </div>
    </div>
  );
};

export default PersonPage;

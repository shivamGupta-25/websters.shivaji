// NOTE: This file was automatically updated to use fetchTechelonsData instead of importing from techelonsData directly.
// Please review and update the component to use the async fetchTechelonsData function.
import { memo } from "react";
import {
  BookOpen,
  Calendar,
  Clock,
  Info,
  Mail,
  MapPin,
  Phone,
  Ticket,
  Trophy,
  User,
  Users
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ICON_SIZE } from "./constants";
import { SectionHeading, InfoCard, RegistrationStatus } from "./UIComponents";
import { fetchTechelonsData } from '@/lib/utils';

// Main consolidated component to reduce importing overhead
const EventContent = memo(({ event, formattedEventDateTime }) => {
  if (!event) return null;

  const { formattedDate, formattedTime, dayOfWeek } = formattedEventDateTime || {
    formattedDate: null,
    formattedTime: null,
    dayOfWeek: null,
  };

  // Helper to determine day display
  const getDayDisplay = () => {
    if (!event.festDay) return "";
    return event.festDay === "day1" ? "Day 1" : "Day 2";
  };

  // Helper to render content sections only if they exist
  const renderSection = (title, content, icon, Component, props = {}) => {
    if (!content || (Array.isArray(content) && !content.length)) return null;

    return (
      <section className="pt-5">
        <SectionHeading icon={icon}>{title}</SectionHeading>
        <Component content={content} {...props} />
      </section>
    );
  };

  return (
    <div className="space-y-5">
      {/* Event Details */}
      <InfoCard icon={<Info className={ICON_SIZE} />} title="Event Details">
        {/* Tagline */}
        {event.tagline && (
          <div className="mb-4 text-sm italic text-primary/90 border-l-2 border-primary/70 pl-3 py-1.5 bg-primary/5 rounded-r-sm">
            "{event.tagline}"
          </div>
        )}

        <div className="text-sm text-muted-foreground grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Date and Time */}
          <div className="flex items-start group">
            <Calendar className="h-4 w-4 mr-2 text-primary flex-shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-110" />
            <div>
              <div className="font-medium text-primary mb-1">
                {getDayDisplay()}
              </div>
              <div className="text-foreground/80">{formattedDate} <span className="text-primary/70">({dayOfWeek})</span></div>
              <div className="text-foreground/80">{formattedTime}</div>
              {event.duration && (
                <div className="flex items-center mt-1.5 text-foreground/70">
                  <Clock className="h-3 w-3 mr-1.5" />
                  <span>Duration: {event.duration}</span>
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          {event.venue && (
            <div className="flex items-start group">
              <MapPin className="h-4 w-4 mr-2 text-primary flex-shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-110" />
              <div>
                <div className="font-medium mb-1">Location</div>
                <div className="break-words text-foreground/80">{event.venue}</div>
              </div>
            </div>
          )}

          {/* Speaker */}
          {event.speaker && (
            <div className="flex items-start group">
              <User className="h-4 w-4 mr-2 text-primary flex-shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-110" />
              <div>
                <div className="font-medium mb-1">Speaker</div>
                <div className="break-words text-foreground/80">{event.speaker}</div>
              </div>
            </div>
          )}

          {/* Registration status */}
          <div className="flex items-start group">
            <Ticket className="h-4 w-4 mr-2 text-primary flex-shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-110" />
            <div>
              <div className="font-medium mb-1">Registration</div>
              <div className="flex items-center">
                <RegistrationStatus status={event.registrationStatus || 'closed'} />
              </div>
            </div>
          </div>
        </div>
      </InfoCard>

      {/* Description */}
      {renderSection(
        "Description",
        event.description,
        <BookOpen className={ICON_SIZE} />,
        ({ content }) => (
          <div className="prose prose-sm max-w-none text-foreground/80">
            <p className="whitespace-pre-line leading-relaxed">{content}</p>
          </div>
        )
      )}

      {/* Rules */}
      {renderSection(
        "Rules",
        event.rules,
        <Info className={`${ICON_SIZE} text-blue-500`} />,
        ({ content }) => (
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/10 border border-blue-200 dark:border-blue-800/40 rounded-lg p-4 shadow-md transition-all duration-300 hover:shadow-lg">
            <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/90">
              {content.map((rule, index) => (
                <li key={index} className="leading-relaxed">{rule}</li>
              ))}
            </ul>
          </div>
        )
      )}

      {/* Competition Structure */}
      {renderSection(
        "Competition Structure",
        event.competitionStructure,
        <Trophy className={`${ICON_SIZE} text-indigo-500`} />,
        ({ content }) => (
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/20 dark:to-indigo-900/10 border border-indigo-200 dark:border-indigo-800/40 rounded-lg p-4 shadow-md transition-all duration-300 hover:shadow-lg">
            <ol className="list-decimal pl-5 space-y-2 text-sm text-foreground/90">
              {content.map((item, index) => (
                <li key={index} className="leading-relaxed">{item}</li>
              ))}
            </ol>
          </div>
        )
      )}

      {/* Evaluation Criteria */}
      {renderSection(
        "Evaluation Criteria",
        event.evaluationCriteria,
        <BookOpen className={`${ICON_SIZE} text-emerald-500`} />,
        ({ content }) => (
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/20 dark:to-emerald-900/10 border border-emerald-200 dark:border-emerald-800/40 rounded-lg p-4 shadow-md transition-all duration-300 hover:shadow-lg">
            <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/90">
              {content.map((criterion, index) => (
                <li key={index} className="leading-relaxed">{criterion}</li>
              ))}
            </ul>
          </div>
        )
      )}

      {/* Instructions */}
      {renderSection(
        "Instructions",
        event.instructions,
        <Info className={`${ICON_SIZE} text-purple-500`} />,
        ({ content }) => (
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/10 border border-purple-200 dark:border-purple-800/40 rounded-lg p-4 shadow-md transition-all duration-300 hover:shadow-lg">
            <p className="whitespace-pre-line text-sm text-foreground/90 leading-relaxed">{content}</p>
          </div>
        )
      )}

      {/* Team Size */}
      {renderSection(
        "Team Size",
        event.teamSize,
        <Users className={`${ICON_SIZE} text-cyan-500`} />,
        ({ content }) => (
          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950/20 dark:to-cyan-900/10 border border-cyan-200 dark:border-cyan-800/40 rounded-lg p-4 text-sm text-foreground/90 shadow-md transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-cyan-200 dark:bg-cyan-700/40 flex items-center justify-center text-cyan-700 dark:text-cyan-300 mr-3">
                {typeof content === "object" ? content.max : content}
              </div>
              <div>
                {typeof content === "object" && content.min !== undefined && content.max !== undefined
                  ? `${content.min} - ${content.max} members`
                  : typeof content === "number" || typeof content === "string"
                    ? `${content} ${parseInt(content) === 1 ? "member" : "members"}`
                    : content}
              </div>
            </div>
          </div>
        )
      )}

      {/* Prizes */}
      {renderSection(
        "Prizes",
        event.prizes,
        <Trophy className={`${ICON_SIZE} text-amber-500`} />,
        ({ content }) => (
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/10 border border-amber-200 dark:border-amber-800/40 rounded-lg p-4 text-sm text-foreground/80 shadow-md transition-all duration-300 hover:shadow-lg">
            {Array.isArray(content) ? (
              <ul className="list-none pl-1 space-y-3">
                {content.map((prize, index) => (
                  <li key={index} className="leading-relaxed flex items-start">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-200 dark:bg-amber-700/40 text-amber-700 dark:text-amber-300 mr-3 flex-shrink-0">
                      {index + 1}
                    </div>
                    {typeof prize === 'object' && prize.position && prize.reward ?
                      <div>
                        <span className="font-semibold text-amber-700 dark:text-amber-300">{prize.position}:</span>{' '}
                        <span className="text-foreground/90">{prize.reward}</span>
                      </div> :
                      prize}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="whitespace-pre-line leading-relaxed">{content}</p>
            )}
          </div>
        )
      )}

      {/* Coordinators */}
      {renderSection(
        "Coordinators",
        event.coordinators,
        <User className={`${ICON_SIZE} text-rose-500`} />,
        ({ content }) => (
          <div className="space-y-3">
            {Array.isArray(content) ? content.map((coordinator, index) => (
              <div key={index} className="flex flex-col bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950/20 dark:to-rose-900/10 border border-rose-200 dark:border-rose-800/40 rounded-lg p-4 shadow-md transition-all duration-300 hover:shadow-lg">
                <span className="font-medium text-foreground">{coordinator.name || coordinator}</span>
                {coordinator.email && (
                  <a
                    href={`mailto:${coordinator.email}`}
                    className="flex items-center text-xs text-muted-foreground hover:text-rose-500 mt-2 group"
                  >
                    <Mail className="h-3 w-3 mr-1.5 group-hover:scale-110 transition-transform duration-300" />
                    {coordinator.email}
                  </a>
                )}
                {coordinator.phone && (
                  <a
                    href={`tel:${coordinator.phone}`}
                    className="flex items-center text-xs text-muted-foreground hover:text-rose-500 mt-1 group"
                  >
                    <Phone className="h-3 w-3 mr-1.5 group-hover:scale-110 transition-transform duration-300" />
                    {coordinator.phone}
                  </a>
                )}
              </div>
            )) : (
              <div className="bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950/20 dark:to-rose-900/10 border border-rose-200 dark:border-rose-800/40 rounded-lg p-4 shadow-md transition-all duration-300 hover:shadow-lg">
                <span className="text-sm text-foreground/80">{content}</span>
              </div>
            )}
          </div>
        )
      )}

      {/* Resources */}
      {renderSection(
        "Resources",
        event.resources,
        <BookOpen className={ICON_SIZE} />,
        ({ content }) => (
          <div className="space-y-2">
            {Array.isArray(content) ? content.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-background/80 border border-border/40 hover:border-primary/20 rounded-lg hover:bg-primary/5 transition-all duration-300 group"
              >
                <div className="flex-1 text-foreground/80 group-hover:text-primary/90">{resource.title || resource.url || resource}</div>
                <div className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary/70 group-hover:text-primary">
                    <path d="M7 7h10v10" />
                    <path d="M7 17 17 7" />
                  </svg>
                </div>
              </a>
            )) : (
              <div className="p-4 bg-background/80 border border-border/40 hover:border-border/60 rounded-lg shadow-sm transition-all duration-300">
                <p className="whitespace-pre-line text-sm text-foreground/80 leading-relaxed">{content}</p>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
});

EventContent.displayName = "EventContent";

export default EventContent; 
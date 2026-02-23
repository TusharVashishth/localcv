/* ****** Minimal Resume Template ****** */

import type { ResumeTemplateData } from "./index";

export function MinimalTemplate({ data }: { data: ResumeTemplateData }) {
  return (
    <div className="bg-white text-black font-sans max-w-[210mm] mx-auto p-10 text-sm leading-relaxed">
      {/* ****** Header ****** */}
      <div className="mb-8">
        <h1 className="text-3xl font-light tracking-wide">{data.fullName}</h1>
        <div className="flex gap-3 mt-2 text-gray-500 text-xs">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>·</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.location && <span>·</span>}
          {data.location && <span>{data.location}</span>}
        </div>
      </div>

      {/* ****** Summary ****** */}
      {data.summary && (
        <section className="mb-8">
          <p className="text-xs text-gray-600 leading-relaxed max-w-2xl">
            {data.summary}
          </p>
        </section>
      )}

      {/* ****** Experience ****** */}
      {data.experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
            Experience
          </h2>
          {data.experience.map((exp, i) => (
            <div key={i} className="mb-5">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium text-xs">{exp.role}</h3>
                  <p className="text-xs text-gray-500">{exp.company}</p>
                </div>
                <span className="text-xs text-gray-400 shrink-0">
                  {exp.startDate} – {exp.endDate}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">{exp.description}</p>
            </div>
          ))}
        </section>
      )}

      {/* ****** Education ****** */}
      {data.education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
            Education
          </h2>
          {data.education.map((edu, i) => (
            <div key={i} className="mb-3 flex justify-between">
              <div>
                <h3 className="font-medium text-xs">
                  {edu.degree} in {edu.field}
                </h3>
                <p className="text-xs text-gray-500">{edu.institution}</p>
              </div>
              <span className="text-xs text-gray-400 shrink-0">
                {edu.startDate} – {edu.endDate}
              </span>
            </div>
          ))}
        </section>
      )}

      {/* ****** Skills ****** */}
      {data.skills.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
            Skills
          </h2>
          <p className="text-xs text-gray-600">{data.skills.join("  ·  ")}</p>
        </section>
      )}
    </div>
  );
}

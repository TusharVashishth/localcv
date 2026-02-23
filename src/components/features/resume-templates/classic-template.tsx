/* ****** Classic Resume Template ****** */

import type { ResumeTemplateData } from "./index";

export function ClassicTemplate({ data }: { data: ResumeTemplateData }) {
  return (
    <div className="bg-white text-black p-8 font-serif max-w-[210mm] mx-auto text-sm leading-relaxed">
      {/* ****** Header ****** */}
      <div className="text-center border-b-2 border-black pb-4 mb-4">
        <h1 className="text-2xl font-bold uppercase tracking-wider">
          {data.fullName}
        </h1>
        <p className="text-xs mt-1 text-gray-600">
          {[data.email, data.phone, data.location].filter(Boolean).join(" | ")}
        </p>
      </div>

      {/* ****** Summary ****** */}
      {data.summary && (
        <section className="mb-4">
          <h2 className="text-sm font-bold uppercase border-b border-gray-300 pb-1 mb-2">
            Professional Summary
          </h2>
          <p className="text-xs">{data.summary}</p>
        </section>
      )}

      {/* ****** Experience ****** */}
      {data.experience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-sm font-bold uppercase border-b border-gray-300 pb-1 mb-2">
            Experience
          </h2>
          {data.experience.map((exp, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-xs">{exp.role}</h3>
                <span className="text-xs text-gray-500">
                  {exp.startDate} – {exp.endDate}
                </span>
              </div>
              <p className="text-xs italic">{exp.company}</p>
              <p className="text-xs mt-1">{exp.description}</p>
            </div>
          ))}
        </section>
      )}

      {/* ****** Education ****** */}
      {data.education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-sm font-bold uppercase border-b border-gray-300 pb-1 mb-2">
            Education
          </h2>
          {data.education.map((edu, i) => (
            <div key={i} className="mb-2">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-xs">
                  {edu.degree} in {edu.field}
                </h3>
                <span className="text-xs text-gray-500">
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
              <p className="text-xs italic">{edu.institution}</p>
            </div>
          ))}
        </section>
      )}

      {/* ****** Skills ****** */}
      {data.skills.length > 0 && (
        <section>
          <h2 className="text-sm font-bold uppercase border-b border-gray-300 pb-1 mb-2">
            Skills
          </h2>
          <p className="text-xs">{data.skills.join(" • ")}</p>
        </section>
      )}
    </div>
  );
}

/* ****** Modern Resume Template ****** */

import type { ResumeTemplateData } from "./index";

export function ModernTemplate({ data }: { data: ResumeTemplateData }) {
  return (
    <div className="bg-white text-black font-sans max-w-[210mm] mx-auto text-sm">
      {/* ****** Header with accent ****** */}
      <div className="bg-blue-600 text-white p-8">
        <h1 className="text-3xl font-bold">{data.fullName}</h1>
        <div className="flex gap-4 mt-2 text-blue-100 text-xs">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.location && <span>{data.location}</span>}
        </div>
      </div>

      <div className="p-8">
        {/* ****** Summary ****** */}
        {data.summary && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-blue-600 mb-2">About</h2>
            <p className="text-xs text-gray-700 leading-relaxed">
              {data.summary}
            </p>
          </section>
        )}

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2">
            {/* ****** Experience ****** */}
            {data.experience.length > 0 && (
              <section className="mb-6">
                <h2 className="text-lg font-bold text-blue-600 mb-3">
                  Experience
                </h2>
                {data.experience.map((exp, i) => (
                  <div key={i} className="mb-4 pl-4 border-l-2 border-blue-200">
                    <h3 className="font-bold text-xs">{exp.role}</h3>
                    <p className="text-xs text-blue-600">{exp.company}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {exp.startDate} – {exp.endDate}
                    </p>
                    <p className="text-xs mt-1 text-gray-700">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </section>
            )}

            {/* ****** Education ****** */}
            {data.education.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-blue-600 mb-3">
                  Education
                </h2>
                {data.education.map((edu, i) => (
                  <div key={i} className="mb-3 pl-4 border-l-2 border-blue-200">
                    <h3 className="font-bold text-xs">
                      {edu.degree} in {edu.field}
                    </h3>
                    <p className="text-xs text-blue-600">{edu.institution}</p>
                    <p className="text-xs text-gray-400">
                      {edu.startDate} – {edu.endDate}
                    </p>
                  </div>
                ))}
              </section>
            )}
          </div>

          {/* ****** Skills sidebar ****** */}
          <div>
            {data.skills.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-blue-600 mb-3">Skills</h2>
                <div className="flex flex-wrap gap-1.5">
                  {data.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import {
    FileText,
    Target,
    BriefcaseBusiness,
    UserCheck,
    MailOpen,
} from "lucide-react";

/* ****** Step card data ****** */
export const STEPS = [
    {
        step: "01",
        title: "Build Your Profile",
        description:
            "Add work history, skills, and education once — reuse across every resume forever.",
        icon: UserCheck,
        accent: "teal",
        gradient: "from-primary/12 via-primary/5 to-transparent",
        border: "border-primary/20 dark:border-primary/15",
        iconBg: "from-primary to-emerald-500",
        iconShadow: "shadow-primary/25",
        badgeClass:
            "bg-primary/10 text-primary border-primary/20 dark:border-primary/30",
        textAccent: "text-primary",
        stepColor: "text-primary/20 dark:text-primary/15",
    },
    {
        step: "02",
        title: "Pick Template & Build Resume",
        description:
            "Choose from Classic, Modern, Technical, Executive and more — export as PDF instantly.",
        icon: FileText,
        accent: "violet",
        gradient: "from-violet-500/12 via-violet-500/5 to-transparent",
        border: "border-violet-500/20 dark:border-violet-500/15",
        iconBg: "from-violet-500 to-purple-600",
        iconShadow: "shadow-violet-500/25",
        badgeClass:
            "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
        textAccent: "text-violet-600 dark:text-violet-400",
        stepColor: "text-violet-500/20 dark:text-violet-400/15",
    },
] as const;

/* ****** AI feature cards ****** */
export const AI_FEATURES = [
    {
        key: "company",
        title: "Company-wise Resume",
        description:
            "Generate AI-tailored resumes targeted to specific companies and role requirements.",
        icon: BriefcaseBusiness,
        iconBg: "from-violet-500 to-pink-500",
        iconShadow: "shadow-violet-500/30",
        gradient: "from-violet-500/8 via-pink-500/5 to-transparent",
        border: "border-violet-200/60 dark:border-violet-800/30",
        badge:
            "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
        glow: "bg-pink-500/8 dark:bg-pink-500/5",
        route: "/dashboard/company-resumes",
        label: "Open Company Resumes",
    },
    {
        key: "ats",
        title: "ATS Score Checker",
        description:
            "Paste a job description to get ATS compatibility score, keyword gaps, and fix suggestions.",
        icon: Target,
        iconBg: "from-emerald-500 to-teal-500",
        iconShadow: "shadow-emerald-500/30",
        gradient: "from-emerald-500/8 via-teal-500/5 to-transparent",
        border: "border-emerald-200/60 dark:border-emerald-800/30",
        badge:
            "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        glow: "bg-teal-500/8 dark:bg-teal-500/5",
        route: "/dashboard/ats-scorer",
        label: "Check ATS Score",
    },
    {
        key: "cover",
        title: "Cover Letter Generator",
        description:
            "Craft personalised, compelling cover letters for any job in seconds using AI.",
        icon: MailOpen,
        iconBg: "from-orange-500 to-amber-500",
        iconShadow: "shadow-orange-500/30",
        gradient: "from-orange-500/8 via-amber-500/5 to-transparent",
        border: "border-orange-200/60 dark:border-orange-800/30",
        badge:
            "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
        glow: "bg-amber-500/8 dark:bg-amber-500/5",
        route: "/dashboard/company-resumes",
        label: "Generate Cover Letter",
    },
    {
        key: "tracker",
        title: "Applications Tracker",
        description:
            "Track jobs in a Kanban pipeline, link tailored resumes/covers, and review conversion metrics.",
        icon: BriefcaseBusiness,
        iconBg: "from-blue-500 to-indigo-500",
        iconShadow: "shadow-blue-500/30",
        gradient: "from-blue-500/8 via-indigo-500/5 to-transparent",
        border: "border-blue-200/60 dark:border-blue-800/30",
        badge:
            "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
        glow: "bg-indigo-500/8 dark:bg-indigo-500/5",
        route: "/dashboard/tracker",
        label: "Open Tracker",
    },
] as const;
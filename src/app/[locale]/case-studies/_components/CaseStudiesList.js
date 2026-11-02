import { projects } from "@/src/app/[locale]/services/_data/projects";
import CaseStudyCard from "./CaseStudyCard";

export default function CaseStudiesList() {
    return (
        <div className="grid gap-4 pb-20 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
                <CaseStudyCard key={project.id} project={project} />
            ))}
        </div>
    );
}

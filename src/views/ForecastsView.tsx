import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { PageIntro, SectionTitle, External } from "../components/Editorial";
import { ForecastExplorer } from "../components/ForecastExplorer";
import { ResearchLab } from "../components/ResearchLab";
import { canonical } from "../lib/data";
export function ForecastsView() {
  return (
    <div className="page container">
      <PageIntro
        number="THE FUTURES"
        title={
          <>
            The future is <em>a range.</em>
          </>
        }
      >
        Useful AI is already here. The difficult question is when it becomes
        capable enough to transform research—and how quickly the rest follows.
      </PageIntro>
      <ForecastExplorer />
      <section className="section">
        <ResearchLab />
      </section>
      <section className="outside-view">
        <SectionTitle
          label="STEP OUTSIDE THIS COMPARISON"
          title={
            <>
              Not everyone sees
              <br />
              <em>the same decade.</em>
            </>
          }
        />
        {canonical.outside_views.map((v) => (
          <div className="outside-row" key={v.id}>
            <div>
              <span className="eyebrow">
                {v.short_name} / {v.as_of}
              </span>
              <h3>{v.headline}</h3>
              <p>{v.population}</p>
            </div>
            <div>
              <p>{v.definition}</p>
              <p className="muted">{v.comparison_note}</p>
              <External href={v.source_url}>{v.source_label}</External>
            </div>
          </div>
        ))}
      </section>
      <div className="next-page">
        <div>
          <span className="eyebrow">A FORECAST NEEDS A WAY TO BE WRONG</span>
          <h2>What would move these dates?</h2>
        </div>
        <Link className="button" to="/falsifiers">
          See the tests <ArrowUpRight size={16} />
        </Link>
      </div>
    </div>
  );
}

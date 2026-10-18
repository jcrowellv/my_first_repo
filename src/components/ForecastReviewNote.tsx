import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { canonical } from "../lib/data";
import { formatIsoDate } from "../lib/dates";
export function ForecastReviewNote() {
  const review = canonical.agent_assessment;
  return (
    <aside className="review-note">
      <span className="eyebrow">
        HOUSE FORECAST / {formatIsoDate(review.as_of)}
      </span>
      <p>{review.forecast_note}</p>
      <Link className="text-link" to="/methodology#agent-update">
        Read the update and assumptions <ArrowUpRight size={14} />
      </Link>
    </aside>
  );
}

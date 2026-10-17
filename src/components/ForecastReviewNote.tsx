import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { canonical } from "../lib/data";
import { formatIsoDate } from "../lib/dates";
export function ForecastReviewNote() {
  const review = canonical.research_review;
  return (
    <aside className="review-note">
      <span className="eyebrow">
        EVIDENCE REVIEW / {formatIsoDate(review.as_of)}
      </span>
      <p>{review.forecast_note}</p>
      <Link className="text-link" to="/rsi#forecast-impact">
        Read the October assessment <ArrowUpRight size={14} />
      </Link>
    </aside>
  );
}

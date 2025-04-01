/**
 * BadgeComp is a higher-order component that generates a badge component
 * with a specified badge type.
 *
 * @param {string} [badgeType="primary"] - The type of the badge, which determines
 * the CSS class applied to the badge (e.g., "primary", "secondary").
 * @returns {Function} A React functional component that renders a badge
 * with the specified text and badge type.
 *
 * @example
 * const PrimaryBadge = BadgeComp("primary");
 * <PrimaryBadge text="Hello" /> // Renders a badge with "Hello" and primary styling.
 */
const BadgeComp = (badgeType = "primary") => {
  return ({ text }) => (
    <span className={`badge badge-${badgeType}`}>{text}</span>
  );
};

// warning alert
export const BadgeWarning = BadgeComp("warning");

// success alert
export const BadgeSuccess = BadgeComp("success");

// error alert
export const BadgeDanger = BadgeComp("danger");

// info alert
export const BadgeInfo = BadgeComp("info");

// primary alert
export const Badge = BadgeComp();

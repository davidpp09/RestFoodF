import { coloresRoles } from "./colores";

const RolBadge = ({ rol }) => (
    <span className={`inline-flex items-center h-[22px] px-2 rounded-[3px] text-[11px] font-bold tracking-[.02em] ${coloresRoles[rol] || "text-rf-text-3 bg-rf-surface-2"}`}>
        {rol}
    </span>
);

export default RolBadge;

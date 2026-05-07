import { getStatusBadge } from "../utils/statusBadge";

type Props = {
  status?: string;
};

export default function StatusBadge({ status }: Props) {
  const normalizedStatus = status?.toLowerCase();

  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
        normalizedStatus
      )}`}
    >
      {status}
    </span>
  );
}
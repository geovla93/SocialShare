import { formatDistanceToNow } from "date-fns";

export default function calculateDate(createdAt: string) {
  return formatDistanceToNow(new Date(createdAt), { addSuffix: true });
}

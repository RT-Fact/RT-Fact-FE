import dayjs from "dayjs";
import "dayjs/locale/ko";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
dayjs.locale("ko");

export const formatDate = (dateString: string) => {
  return dayjs(dateString).fromNow();
};

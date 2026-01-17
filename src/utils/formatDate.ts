import dayjs from "dayjs";
import "dayjs/locale/ko";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
dayjs.locale("ko");

export const formatRelativeDate = (dateString: string) => {
  return dayjs(dateString).fromNow();
};

export const formatAbsoluteDate = (dateString: string) => {
  return dayjs(dateString).format("YYYY년 M월 D일");
};

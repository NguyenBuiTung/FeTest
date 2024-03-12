import dayjs from "dayjs";

const formatDateTime = (createdAt) => {
  const date = new Date(createdAt);
  const formattedDateTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} - ${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}`;

  return formattedDateTime;
};

export default formatDateTime;

export const calculateTimeDifference = (currenDate, endDate) => {
  // const startDateTime = new Date(startDate);
  const endDateTime = new Date(endDate);
  const currentDateTime = new Date(); // Thời gian hiện tại

  const timeDifference = endDateTime - currentDateTime; // Kết quả sẽ là milliseconds từ endDate đến thời gian hiện tại

  // Chuyển đổi milliseconds thành đơn vị thời gian mong muốn (ví dụ: ngày, giờ, phút...)
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // Format kết quả theo định dạng bạn muốn (ví dụ: ngày/giờ/phút/...)
  const formattedTimeDifference = `${days} ngày, ${hours % 24} giờ, ${
    minutes % 60
  } phút`;

  return formattedTimeDifference;
};
const startOfThisWeek = dayjs().startOf("week"); // Bắt đầu của tuần này
const endOfThisWeek = dayjs().endOf("week") && dayjs().startOf("day"); // Kết thúc của tuần này

const startOfThisMonth = dayjs().startOf("month"); // Bắt đầu của tháng này
const endOfThisMonth = dayjs().endOf("month") && dayjs().startOf("day"); // Kết thúc của tháng này

const startOfLastMonth = dayjs().subtract(1, "month").startOf("month"); // Bắt đầu của tháng trước
const endOfLastMonth = dayjs().subtract(1, "month").endOf("month"); // Kết thúc của tháng trước
export const rangePresets = [
  {
    label: <span>Hôm nay</span>,
    value: [dayjs().startOf("day"), dayjs().endOf("day")],
  },
  {
    label: <span>Hôm qua</span>,
    value: [
      dayjs().subtract(1, "day").startOf("day"),
      dayjs().subtract(1, "day").endOf("day"),
    ],
  },
  {
    label: <span>Tuần này</span>,
    value: [startOfThisWeek, endOfThisWeek],
  },
  {
    label: <span>Tháng này</span>,
    value: [startOfThisMonth, endOfThisMonth],
  },
  {
    label: <span>Tháng trước</span>,
    value: [startOfLastMonth, endOfLastMonth],
  },
  {
    label: <span>7 ngày gần đây</span>,
    value: [
      dayjs().subtract(6, "day").startOf("day"),
      dayjs().subtract(0, "day").endOf("day"),
    ],
  },

  {
    label: <span>14 ngày gần đây</span>,
    value: [
      dayjs().subtract(13, "day").startOf("day"),
      dayjs().subtract(0, "day").endOf("day"),
    ],
  },
  {
    label: <span>30 ngày gần đây</span>,
    value: [
      dayjs().subtract(29, "day").startOf("day"),
      dayjs().subtract(0, "day").endOf("day"),
    ],
  },
  {
    label: <span>90 ngày gần đây</span>,
    value: [
      dayjs().subtract(89, "day").startOf("day"),
      dayjs().subtract(0, "day").endOf("day"),
    ],
  },
];
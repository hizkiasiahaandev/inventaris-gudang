const timeZone = "Asia/Jakarta";

const date =
    (value: string | Date) =>
        new globalThis.Intl.DateTimeFormat("id-ID", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            year: "2-digit",
            timeZone,
        }).format(new Date(value)).replace(/\//g,"-");

const time = (value: string | Date) =>
    new globalThis.Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone,
    }).format(new Date(value));

export { date, time };
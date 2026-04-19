export const GENERATE_HOURS = () => {
    const hours = [];
    for (let i = 8; i <= 21; i++) {
        const h = i.toString().padStart(2, "0");
        hours.push(`${h}:00`, `${h}:30`);
    }
    return hours;
};

export const ORE_LUCRU = GENERATE_HOURS();

/**
 * Verifică dacă un interval orar se suprapune cu altul
 * Folosit pentru logica de coloane paralele în Grid
 */
export const isHourInInterval = (currentHour, startHour, endHour) => {
    if (!startHour || !endHour) return currentHour === startHour;
    const toMin = (h) => {
        const [hrs, mins] = h.split(':').map(Number);
        return hrs * 60 + mins;
    };
    const current = toMin(currentHour);
    const start = toMin(startHour);
    const end = toMin(endHour);
    return current >= start && current < end;
};

export const COLOR_MAP = {
    "#E6E6FA": { bg: "bg-[#E6E6FA]", border: "border-[#B19CD9]", text: "text-[#5E4B8B]", darkBg: "dark:bg-[#E6E6FA]/20" },
    "#F0F8FF": { bg: "bg-[#F0F8FF]", border: "border-[#B0C4DE]", text: "text-[#4682B4]", darkBg: "dark:bg-[#F0F8FF]/20" },
    "#F5FFFA": { bg: "bg-[#F5FFFA]", border: "border-[#98FB98]", text: "text-[#2E8B57]", darkBg: "dark:bg-[#F5FFFA]/20" },
    "#FFF5EE": { bg: "bg-[#FFF5EE]", border: "border-[#FFDAB9]", text: "text-[#CD853F]", darkBg: "dark:bg-[#FFF5EE]/20" },
    "#FFF0F5": { bg: "bg-[#FFF0F5]", border: "border-[#FFB6C1]", text: "text-[#C71585]", darkBg: "dark:bg-[#FFF0F5]/20" },
};
export const GENERATE_HOURS = () => {
    const hours = [];
    for (let i = 7; i <= 21; i++) {
        const h = i.toString().padStart(2, "0");
        hours.push(`${h}:00`, `${h}:30`);
    }
    return [...hours, "22:00"];
};

export const ORE_LUCRU = GENERATE_HOURS();

export const COLOR_MAP = {
    "#E6E6FA": { bg: "bg-[#E6E6FA]", border: "border-[#B19CD9]", text: "text-[#5E4B8B]" },
    "#F0F8FF": { bg: "bg-[#F0F8FF]", border: "border-[#B0C4DE]", text: "text-[#4682B4]" },
    "#F5FFFA": { bg: "bg-[#F5FFFA]", border: "border-[#98FB98]", text: "text-[#2E8B57]" },
    "#FFF5EE": { bg: "bg-[#FFF5EE]", border: "border-[#FFDAB9]", text: "text-[#CD853F]" },
    "#FFF0F5": { bg: "bg-[#FFF0F5]", border: "border-[#FFB6C1]", text: "text-[#C71585]" },
};
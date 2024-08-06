export function parseDate(dateStr) {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateStr.match(regex);
    if (!match) return null;

    const [_, day, month, year] = match.map(Number);
    const date = new Date(year, month - 1, day);

    if (date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day) {
        return date;
    }
    return null;
}

export function isValidDate(dateStr) {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateStr.match(regex);
    if (!match) return false;

    const [_, day, month, year] = match.map(Number);
    const date = new Date(year, month - 1, day);

    return date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day;
}

export function convertIsoToDate(isoDateStr) {
    const date = new Date(isoDateStr);

    // Extraindo dia, mês e ano
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() retorna 0-11
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}
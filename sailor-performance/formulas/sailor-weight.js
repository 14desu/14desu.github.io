// kg per person; Korea and Global use the same national coefficients.
const KG_PER_PERSON = Object.freeze([500, 530, 550, 500, 565, 500, 500, 500, 500]);

export function calculateSailorWeightKg(nationId, currentCrew) {
    const coefficient = KG_PER_PERSON[nationId];
    if (!Number.isInteger(nationId) || coefficient === undefined
        || !Number.isInteger(currentCrew) || currentCrew < 0) return null;
    return currentCrew * coefficient;
}

export function calculateShipSailorWeightKg(sailors, { submarine = false } = {}) {
    let total = 0;
    for (const { nationId, currentCrew } of sailors) {
        const weight = calculateSailorWeightKg(nationId, currentCrew);
        if (weight === null) return null;
        total += weight;
    }
    // The submarine correction applies once, after all occupied seats are summed.
    return submarine ? Math.trunc(total * 0.12) : total;
}

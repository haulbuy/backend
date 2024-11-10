// deno-lint-ignore-file no-explicit-any

const sugargooApiBaseUrl = " https://api.sugargoo.com/api";

/**
 * Calculates the shipping cost based on the destination and package dimensions.
 *
 * @param country - The destination country for the shipment.
 * @param region - The destination region within the country.
 * @param weight - The weight of the package in kilograms.
 * @param height - The height of the package in centimeters.
 * @param width - The width of the package in centimeters.
 * @param length - The length of the package in centimeters.
 * @returns A promise that resolves to the calculated shipping cost.
 */
export const calculateShippingSugargoo = async (
    country: string,
    region: string,
    weight: number,
    height: number,
    width: number,
    length: number,
    forbiddenAttributeIds: string[],
) => {
    const volume = height * width * length;

    const data = await fetchShippingLines(
        country,
        length,
        forbiddenAttributeIds,
        1,
        region,
        weight,
        volume,
    );

    return { shippingLines: data.data };
};

/**
 * Fetches shipping lines based on the provided parameters.
 *
 * @param {string} countryId - The ID of the country.
 * @param {number} maxLength - The maximum length of the package.
 * @param {string} postalId - The postal ID.
 * @param {number} recommendType - The type of recommendation.
 * @param {string} regionId - The ID of the region.
 * @param {number} weight - The weight of the package.
 * @param {number} volume - The volume of the package.
 * @returns {Promise<any>} A promise that resolves to the fetched shipping lines data.
 * @throws Will throw an error if the fetch operation fails.
 */
async function fetchShippingLines(
    countryId: string,
    maxLength: number,
    postalId: string[],
    recommendType: number,
    regionId: string,
    weight: number,
    volume: number,
) {
    const apiUrl = `${sugargooApiBaseUrl}/logisticscecenter/estimate/recommand`;

    const bodyData = {
        countryId,
        maxLength,
        postalId,
        recommendType,
        regionId,
        weight,
        volume,
        lang: "en_US"
    };

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "bGFtcF93ZWI6bGFtcF93ZWJfc2VjcmV0",
                "Origin": "https://www.sugargoo.com",
            },
            body: JSON.stringify(bodyData),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch shipping lines");
        }

        const data = await response.json();
        console.log("Shipping lines fetched: ", data);

        return data;
    } catch (error: any) {
        console.error("Error fetching shipping lines: ", error);
        throw error;
    }
}

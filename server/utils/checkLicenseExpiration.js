import { License } from "../models/licensesModel.js";

export const checkLicenseExpiration = async (id) => {
    try {
        const license = await License.findById(id);
        if (!license) {
            throw new Error("License not found");
        }
        const currentDate = new Date();
        if (license.expirationDate < currentDate) {
            return true
        } else {
            return false;
        }

    } catch (error) {
        throw new Error(error.message);
    }
}
import { LicenseType } from "../models/licenseTypesModel.js";
import { Role } from "../models/rolesModel.js";

export const getLicenseTypes = async (req, res, next) => {
  try {
    const licenseTypes = await LicenseType.find();
    res.status(200).json({ success: true, data: licenseTypes });
  } catch (error) {
    next(error);
  }
};

export const getRoles = async (req, res, next) => {
  const { isLanding } = req.query;
  try {
    if (isLanding === "true") {
      const roles = await Role.find({
        canRegister: true,
      });
      return res.status(200).json({ success: true, data: roles });
    }
    const roles = await Role.find({
      canRegister: false,
      name: { $nin: ["administrador"] },
    });
    res.status(200).json({ success: true, data: roles });
  } catch (error) {
    next(error);
  }
};

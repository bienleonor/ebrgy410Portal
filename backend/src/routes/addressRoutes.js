import { Router } from "express";
import * as AddressController from "../controllers/addressController.js";

const router = Router();

//REGIONS
router.get("/regions", AddressController.listRegions);
router.post("/regions", AddressController.createRegion);
router.put("/regions/:id", AddressController.updateRegion);
router.delete("/regions/:id", AddressController.deleteRegion);

//PROVINCES
router.get("/provinces", AddressController.listProvinces);
router.post("/provinces", AddressController.createProvince);
router.put("/provinces/:id", AddressController.updateProvince);
router.delete("/provinces/:id", AddressController.deleteProvince);

//CITIES
router.get("/cities", AddressController.listCities);
router.post("/cities", AddressController.createCity);
router.put("/cities/:id", AddressController.updateCity);
router.delete("/cities/:id", AddressController.deleteCity);

//ZONES
router.get("/zones", AddressController.listZones);
router.get("/zones/:id", AddressController.getZone);
router.post("/zones", AddressController.createZone);
router.put("/zones/:id", AddressController.updateZone);
router.delete("/zones/:id", AddressController.deleteZone);

//BARANGAYS
router.get("/barangays", AddressController.listBarangays);
router.post("/barangays", AddressController.createBarangay);
router.put("/barangays/:id", AddressController.updateBarangay);
router.delete("/barangays/:id", AddressController.deleteBarangay);

//PUROKS
router.get("/purok", AddressController.listPuroks);
router.get("/purok/:id", AddressController.getPurok);
router.post("/purok", AddressController.createPurok);
router.put("/purok/:id", AddressController.updatePurok);
router.delete("/purok/:id", AddressController.deletePurok);

//STREETS
router.get("/streets", AddressController.listStreets);
router.get("/streets/:id", AddressController.getStreet);
router.post("/streets", AddressController.createStreet);
router.put("/streets/:id", AddressController.updateStreet);
router.delete("/streets/:id", AddressController.deleteStreet);

//ADDRESSES
router.get("/addresses", AddressController.listAddresses);
router.get("/addresses/:id", AddressController.getSingleAddress);
router.post("/addresses", AddressController.createAddress);
router.put("/addresses/:id", AddressController.updateAddress);
router.delete("/addresses/:id", AddressController.deleteAddress);
router.post("/addresses/find-or-create", AddressController.findOrCreateAddress);


export default router;

import * as Address from "../models/addressModel.js";

//STREETS TABLE
export const listStreets = async (req, res) => {
  try {
    const data = await Address.getStreets();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const getStreet = async (req, res) => {
  try {
    const data = await Address.getStreetById(req.params.id);
    if (!data) return res.status(404).json({ error: "Street not found" });
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const createStreet = async (req, res) => {
  try {
    const id = await Address.createStreet(req.body);
    res.status(201).json({ street_id: id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const updateStreet = async (req, res) => {
  try {
    await Address.updateStreet(req.params.id, req.body);
    res.json({ message: "Street updated" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const deleteStreet = async (req, res) => {
  try {
    await Address.deleteStreet(req.params.id);
    res.json({ message: "Street deleted" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

//REGION TABLE
export const listRegions = async (req, res) => {
  try {
    const data = await Address.getRegions();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const createRegion = async (req, res) => {
  try {
    const id = await Address.createRegion(req.body);
    res.status(201).json({ region_id: id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const updateRegion = async (req, res) => {
  try {
    await Address.updateRegion(req.params.id, req.body);
    res.json({ message: "Region updated" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const deleteRegion = async (req, res) => {
  try {
    await Address.deleteRegion(req.params.id);
    res.json({ message: "Region deleted" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

//PROVINCE TALBE
export const listProvinces = async (req, res) => {
  try {
    res.json(await Address.getProvinces());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const createProvince = async (req, res) => {
  try {
    const id = await Address.createProvince(req.body);
    res.status(201).json({ prov_id: id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const updateProvince = async (req, res) => {
  try {
    await Address.updateProvince(req.params.id, req.body);
    res.json({ message: "Province updated" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const deleteProvince = async (req, res) => {
  try {
    await Address.deleteProvince(req.params.id);
    res.json({ message: "Province deleted" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// CITIES TABLE
export const listCities = async (req, res) => {
  try {
    res.json(await Address.getCities());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const createCity = async (req, res) => {
  try {
    const id = await Address.createCity(req.body);
    res.status(201).json({ city_id: id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const updateCity = async (req, res) => {
  try {
    await Address.updateCity(req.params.id, req.body);
    res.json({ message: "City updated" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const deleteCity = async (req, res) => {
  try {
    await Address.deleteCity(req.params.id);
    res.json({ message: "City deleted" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

//BARANGAY TABLE
export const listBarangays = async (req, res) => {
  try {
    res.json(await Address.getBarangays());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const createBarangay = async (req, res) => {
  try {
    const id = await Address.createBarangay(req.body);
    res.status(201).json({ brgy_id: id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const updateBarangay = async (req, res) => {
  try {
    await Address.updateBarangay(req.params.id, req.body);
    res.json({ message: "Barangay updated" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const deleteBarangay = async (req, res) => {
  try {
    await Address.deleteBarangay(req.params.id);
    res.json({ message: "Barangay deleted" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

//ZONE TABLE
export const listZones = async (req, res) => {
  try {
    res.json(await Address.getZones());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getZone = async (req, res) => {
  try {
    const zone = await Address.getZoneById(req.params.id);
    if (!zone) return res.status(404).json({ message: "Zone not found" });
    res.json(zone);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createZone = async (req, res) => {
  try {
    const id = await Address.createZone(req.body);
    res.status(201).json({ zone_id: id, message: "Zone created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateZone = async (req, res) => {
  try {
    await Address.updateZone(req.params.id, req.body);
    res.json({ message: "Zone updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteZone = async (req, res) => {
  try {
    await Address.deleteZone(req.params.id);
    res.json({ message: "Zone deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//SITIO-PUROK
export const listPuroks = async (req, res) => {
  try {
    res.json(await Address.getPuroks());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPurok = async (req, res) => {
  try {
    const purok = await Address.getPurokById(req.params.id);
    if (!purok) return res.status(404).json({ message: "Purok/Sitio not found" });
    res.json(purok);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createPurok = async (req, res) => {
  try {
    const id = await Address.createPurok(req.body);
    res.status(201).json({ purok_id: id, message: "Purok/Sitio created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updatePurok = async (req, res) => {
  try {
    await Address.updatePurok(req.params.id, req.body);
    res.json({ message: "Purok/Sitio updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deletePurok = async (req, res) => {
  try {
    await Address.deletePurok(req.params.id);
    res.json({ message: "Purok/Sitio deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//ADDRESS TABLE
export const listAddresses = async (req, res) => {
  try {
    res.json(await Address.getAddresses());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSingleAddress = async (req, res) => {
  try {
    const address = await Address.getAddressById(req.params.id);
    if (!address) return res.status(404).json({ message: "Address not found" });
    res.json(address);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createAddress = async (req, res) => {
  try {
    const newId = await Address.createAddress(req.body);
    res.status(201).json({ addr_id: newId, message: "Address created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateAddress = async (req, res) => {
  try {
    await Address.updateAddress(req.params.id, req.body);
    res.json({ message: "Address updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    await Address.deleteAddress(req.params.id);
    res.json({ message: "Address deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const findOrCreateAddress = async (req, res) => {
  try {
    const addr_id = await Address.findOrCreateAddress(req.body);
    res.json({ addr_id, message: "Address fetched or created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
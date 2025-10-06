import { createResident } from "../models/residentModel.js";

export const addResident = (res, req) => {
    const data = req.body;

    createResident(data, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        
        res.json({
            message: "Resident added succesfully",
            resident_id: result.insertID
        });
    });
};
const express = require("express");
const router = express.Router();
const Notesheet = require("../../models/NotesheetSchema");

router.delete('/:id', async (req, res) => {
    const notesheetId = req.params.id;
    console.log(notesheetId)

    try {
        // Find and delete the notesheet by ID
        const result = await Notesheet.findByIdAndDelete(notesheetId);

        if (!result) {
            return res.status(404).json({ message: "Notesheet not found" });
        }

        return res.status(200).json({ message: "Notesheet deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});
module.exports = router
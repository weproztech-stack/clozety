const Contact = require("../Models/Contact");

// @desc    Submit a contact inquiry
// @route   POST /api/contact
// @access  Public
const submitInquiry = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: "Name, email, subject, and message are required" });
        }

        const contactData = {
            name: name.trim(),
            email: email.trim(),
            phone: phone || "",
            subject: subject.trim(),
            message: message.trim(),
        };

        // Link to user if logged in
        if (req.user) {
            contactData.user = req.user.id;
        }

        const contact = await Contact.create(contactData);
        res.status(201).json({ message: "Your message has been sent successfully", contact });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// ─── ADMIN ───────────────────────────────────────────────

// @desc    Get all contact inquiries
// @route   GET /api/contact
// @access  Admin
const getAllInquiries = async (req, res) => {
    try {
        const { status } = req.query;
        const filter = {};
        if (status) filter.status = status;

        const inquiries = await Contact.find(filter)
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json(inquiries);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Get single inquiry
// @route   GET /api/contact/:id
// @access  Admin
const getInquiryById = async (req, res) => {
    try {
        const inquiry = await Contact.findById(req.params.id).populate("user", "name email");
        if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });

        res.status(200).json(inquiry);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Update inquiry status / add admin notes
// @route   PUT /api/contact/:id
// @access  Admin
const updateInquiry = async (req, res) => {
    try {
        const { status, adminNotes } = req.body;

        const inquiry = await Contact.findById(req.params.id);
        if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });

        if (status) inquiry.status = status;
        if (adminNotes !== undefined) inquiry.adminNotes = adminNotes;

        await inquiry.save();
        res.status(200).json({ message: "Inquiry updated", inquiry });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Delete inquiry
// @route   DELETE /api/contact/:id
// @access  Admin
const deleteInquiry = async (req, res) => {
    try {
        const inquiry = await Contact.findByIdAndDelete(req.params.id);
        if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });

        res.status(200).json({ message: "Inquiry deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

module.exports = { submitInquiry, getAllInquiries, getInquiryById, updateInquiry, deleteInquiry };

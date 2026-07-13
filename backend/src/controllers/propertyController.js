const Property = require('../models/property');

// ── GET ALL PROPERTIES (public) ──────────────────────────────────────────────
exports.getAllProperties = async (req, res) => {
  try {
    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    if (req.query.location) filter.location = { $regex: req.query.location, $options: 'i' };
    if (req.query.status) filter.status = req.query.status;

    const properties = await Property.find(filter)
      .populate('realtorId', 'firstName lastName phone email')
      .sort({ createdAt: -1 });

    res.status(200).json({ status: 'success', results: properties.length, data: { properties } });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
};

// ── GET PROPERTY BY SLUG (public) ─────────────────────────────────────────────
exports.getPropertyBySlug = async (req, res) => {
  try {
    const property = await Property.findOne({ slug: req.params.slug })
      .populate('realtorId', 'firstName lastName phone email');
    if (!property) {
      return res.status(404).json({ status: 'fail', error: 'Property not found' });
    }
    res.status(200).json({ status: 'success', data: { property } });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
};

// ── GET REALTOR'S OWN PROPERTIES (protected) ──────────────────────────────────
exports.getRealtorProperties = async (req, res) => {
  try {
    const properties = await Property.find({ realtorId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', results: properties.length, data: { properties } });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
};

// ── CREATE PROPERTY (protected, Realtor/Admin) ────────────────────────────────
exports.createProperty = async (req, res) => {
  try {
    const {
      name, location, price, priceLabel, type, beds, baths,
      size, image, gallery, description, features, phone, featured,
    } = req.body;

    // Generate slug
    const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    // Ensure unique slug
    let slug = baseSlug;
    let count = 0;
    while (await Property.findOne({ slug })) {
      count++;
      slug = `${baseSlug}-${count}`;
    }

    const property = await Property.create({
      name, slug, location, price, priceLabel, type,
      beds: beds ? parseInt(beds) : null,
      baths: baths ? parseInt(baths) : null,
      size, image,
      gallery: gallery || (image ? [image] : []),
      description,
      features: Array.isArray(features)
        ? features
        : (features ? features.split(',').map(f => f.trim()).filter(Boolean) : []),
      phone: phone || req.user.phone || '',
      realtorId: req.user._id,
      featured: featured || false,
    });

    res.status(201).json({ status: 'success', data: { property } });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

// ── UPDATE PROPERTY (protected, owner only) ───────────────────────────────────
exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ status: 'fail', error: 'Property not found' });

    // Only owner or Admin can update
    if (property.realtorId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ status: 'fail', error: 'Not authorized' });
    }

    const updates = { ...req.body };
    if (updates.beds) updates.beds = parseInt(updates.beds);
    if (updates.baths) updates.baths = parseInt(updates.baths);
    if (updates.features && !Array.isArray(updates.features)) {
      updates.features = updates.features.split(',').map(f => f.trim()).filter(Boolean);
    }

    const updated = await Property.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    res.status(200).json({ status: 'success', data: { property: updated } });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

// ── DELETE PROPERTY (protected, owner/Admin) ──────────────────────────────────
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ status: 'fail', error: 'Property not found' });

    if (property.realtorId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ status: 'fail', error: 'Not authorized' });
    }

    await Property.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

// ── INCREMENT VIEWS (public) ──────────────────────────────────────────────────
exports.incrementViews = async (req, res) => {
  try {
    await Property.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    res.status(200).json({ status: 'success' });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

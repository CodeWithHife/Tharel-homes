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
    let property = await Property.findOne({ slug: req.params.slug })
      .populate('realtorId', 'firstName lastName phone email');
    
    if (!property) {
      // Fallback: search the Hotel collection
      const Hotel = require('../models/hotel');
      const hotel = await Hotel.findOne({ slug: req.params.slug })
        .populate('userId', 'firstName lastName phone email');

      if (hotel) {
        // Map/Normalize the hotel document to match the Property schema shape
        property = {
          _id: hotel._id,
          name: hotel.name,
          slug: hotel.slug || hotel.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
          location: hotel.location,
          price: hotel.pricePerNight,
          priceLabel: hotel.pricePerNight ? `₦${Number(hotel.pricePerNight).toLocaleString()}/night` : 'Price on Request',
          type: hotel.roomType || 'Hotel Room',
          beds: parseInt(hotel.capacity) || null,
          baths: null,
          size: hotel.reservationGoal || '',
          image: hotel.image,
          gallery: [hotel.image],
          description: hotel.description,
          features: hotel.amenities || [],
          phone: hotel.userId?.phone || '',
          views: 0,
          featured: false,
          isHotel: true,
          realtorId: hotel.userId // map hotel owner details to realtorId
        };
        return res.status(200).json({ status: 'success', data: { property } });
      }

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

    if (!name) return res.status(400).json({ status: 'fail', error: 'Property name is required' });

    // Generate slug
    const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
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
    console.error('[createProperty] ERROR:', error.message);
    console.error('[createProperty] STACK:', error.stack);
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

// ── GET CLOUDINARY SIGNATURE (protected) ──────────────────────────────────────
exports.getCloudinarySignature = async (req, res) => {
  try {
    const crypto = require('crypto');
    const timestamp = Math.round(new Date().getTime() / 1000);
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
    const apiSecret   = process.env.CLOUDINARY_API_SECRET;
    const apiKey      = process.env.CLOUDINARY_API_KEY;
    const cloudName   = process.env.CLOUDINARY_CLOUD_NAME;

    if (!apiSecret || !apiKey || !cloudName || !uploadPreset) {
      return res.status(500).json({ status: 'fail', error: 'Cloudinary is not fully configured on the server' });
    }

    // Params must be sorted alphabetically, then API secret appended (no separator)
    // timestamp (t) < upload_preset (u) → correct order
    const stringToSign = `timestamp=${timestamp}&upload_preset=${uploadPreset}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');

    res.status(200).json({
      status: 'success',
      data: { signature, timestamp, apiKey, cloudName, uploadPreset }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
};



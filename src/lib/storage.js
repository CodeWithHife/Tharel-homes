// ── src/lib/storage.js ──────────────────────────────────

import staticProperties from "@/data/properties";

// ── AUTH ──────────────────────────────────────────

export function registerUser(data) {
  var users = getAllUsers();
  var exists = users.find(function (u) { return u.email === data.email; });
  if (exists) return { error: "Email already registered." };

  var user = {
    id: "user_" + Date.now(),
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone || "",
    password: data.password,
    role: data.role || "buyer",
    onboardingDone: false,
    onboardingAnswers: {},
    subscriptionPlan: "basic",
    subscriptionExpiry: null,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  localStorage.setItem("tharel_users", JSON.stringify(users));
  return { user };
}

export function loginUser(email, password) {
  var users = getAllUsers();
  var user = users.find(function (u) { return u.email === email && u.password === password; });
  if (!user) return { error: "Invalid email or password." };
  localStorage.setItem("tharel_current_user", JSON.stringify(user));
  return { user };
}

export function logoutUser() {
  localStorage.removeItem("tharel_current_user");
}

export function getCurrentUser() {
  try {
    var data = localStorage.getItem("tharel_current_user");
    return data ? JSON.parse(data) : null;
  } catch (e) { return null; }
}

export function getAllUsers() {
  try {
    var data = localStorage.getItem("tharel_users");
    return data ? JSON.parse(data) : [];
  } catch (e) { return []; }
}

export function updateCurrentUser(updates) {
  try {
    var current = getCurrentUser();
    if (!current) return;
    var updated = { ...current, ...updates };
    localStorage.setItem("tharel_current_user", JSON.stringify(updated));
    var users = getAllUsers();
    var idx = users.findIndex(function (u) { return u.id === current.id; });
    if (idx >= 0) {
      users[idx] = updated;
      localStorage.setItem("tharel_users", JSON.stringify(users));
    }
    return updated;
  } catch (e) {}
}

// ── UPDATE USER PROFILE ── (no email update)
export function updateUserProfile(userId, updates) {
  try {
    var users = getAllUsers();
    var idx = users.findIndex(function (u) { return u.id === userId; });
    if (idx === -1) return false;
    var allowed = ['firstName', 'lastName', 'phone'];
    var updated = { ...users[idx] };
    for (var key in updates) {
      if (allowed.includes(key)) {
        updated[key] = updates[key];
      }
    }
    users[idx] = updated;
    localStorage.setItem("tharel_users", JSON.stringify(users));
    var current = getCurrentUser();
    if (current && current.id === userId) {
      localStorage.setItem("tharel_current_user", JSON.stringify(updated));
    }
    return true;
  } catch (e) { return false; }
}

// ── PROPERTIES ────────────────────────────────────

export function getAllProperties() {
  try {
    var userProps = JSON.parse(localStorage.getItem("tharel_properties") || "[]");
    var all = [...staticProperties];
    userProps.forEach(function (p) {
      if (!all.find(function (s) { return s.id === p.id; })) {
        all.push(p);
      }
    });
    return all;
  } catch (e) { return staticProperties; }
}

export function getRealtorProperties(realtorId) {
  try {
    var all = JSON.parse(localStorage.getItem("tharel_properties") || "[]");
    return all.filter(function (p) { return p.realtorId === realtorId; });
  } catch (e) { return []; }
}

export function getPropertyBySlug(slug) {
  var all = getAllProperties();
  return all.find(function (p) { return p.slug === slug; });
}

export function getPropertyById(id) {
  var all = getAllProperties();
  return all.find(function (p) { return p.id === id; });
}

export function saveProperty(property) {
  try {
    var all = JSON.parse(localStorage.getItem("tharel_properties") || "[]");
    var idx = all.findIndex(function (p) { return p.id === property.id; });
    if (idx >= 0) {
      all[idx] = { ...all[idx], ...property };
    } else {
      var newProp = {
        ...property,
        id: property.id || "prop_" + Date.now(),
        slug: property.slug || property.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        views: 0,
        createdAt: new Date().toISOString(),
      };
      all.unshift(newProp);
    }
    localStorage.setItem("tharel_properties", JSON.stringify(all));
  } catch (e) {}
}

export function addProperty(property) { saveProperty(property); }
export function updateProperty(property) { saveProperty(property); }

export function deleteProperty(id) {
  try {
    var all = JSON.parse(localStorage.getItem("tharel_properties") || "[]");
    all = all.filter(function (p) { return p.id !== id; });
    localStorage.setItem("tharel_properties", JSON.stringify(all));
  } catch (e) {}
}

export function incrementViews(id) {
  try {
    var all = JSON.parse(localStorage.getItem("tharel_properties") || "[]");
    var prop = all.find(function (p) { return p.id === id; });
    if (prop) {
      prop.views = (prop.views || 0) + 1;
      localStorage.setItem("tharel_properties", JSON.stringify(all));
    }
  } catch (e) {}
}

export function getViews(id) {
  try {
    var all = JSON.parse(localStorage.getItem("tharel_properties") || "[]");
    var prop = all.find(function (p) { return p.id === id; });
    return prop ? prop.views || 0 : 0;
  } catch (e) { return 0; }
}

// ── FAVOURITES ────────────────────────────────────

export function getFavourites(userId) {
  try {
    var data = localStorage.getItem("tharel_favs_" + userId);
    return data ? JSON.parse(data) : [];
  } catch (e) { return []; }
}

export function toggleFavourite(userId, propertyId) {
  try {
    var favs = getFavourites(userId);
    var idx = favs.indexOf(propertyId);
    if (idx >= 0) {
      favs.splice(idx, 1);
    } else {
      favs.push(propertyId);
    }
    localStorage.setItem("tharel_favs_" + userId, JSON.stringify(favs));
    return favs;
  } catch (e) { return []; }
}

// ── SUBSCRIPTION ──────────────────────────────────

export function getSubscriptionPlan(user) {
  if (!user) return null;
  var plan = user.subscriptionPlan || "basic";
  var plans = {
    basic: { id: "basic", name: "Basic", maxListings: 1 },
    plus: { id: "plus", name: "Plus", maxListings: 5 },
    premium: { id: "premium", name: "Premium", maxListings: 50 },
    super: { id: "super", name: "Super Premium", maxListings: Infinity },
  };
  return plans[plan] || plans.basic;
}

export function upgradeSubscription(userId, planId) {
  try {
    var users = getAllUsers();
    var idx = users.findIndex(function (u) { return u.id === userId; });
    if (idx === -1) return false;
    users[idx].subscriptionPlan = planId;
    users[idx].subscriptionExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    localStorage.setItem("tharel_users", JSON.stringify(users));
    var current = getCurrentUser();
    if (current && current.id === userId) {
      updateCurrentUser({ subscriptionPlan: planId, subscriptionExpiry: users[idx].subscriptionExpiry });
    }
    return true;
  } catch (e) { return false; }
}

// ── HOTEL ─────────────────────────────────────────

export function saveHotelListing(hotel) {
  try {
    var all = JSON.parse(localStorage.getItem("tharel_hotels") || "[]");
    var idx = all.findIndex(function (h) { return h.id === hotel.id; });
    if (idx >= 0) {
      all[idx] = { ...all[idx], ...hotel };
    } else {
      var newHotel = {
        ...hotel,
        id: hotel.id || "hotel_" + Date.now(),
        createdAt: new Date().toISOString(),
        status: hotel.status || "Active",
      };
      all.unshift(newHotel);
    }
    localStorage.setItem("tharel_hotels", JSON.stringify(all));
  } catch (e) {}
}

export function getHotelListings(userId) {
  try {
    var all = JSON.parse(localStorage.getItem("tharel_hotels") || "[]");
    if (userId) {
      return all.filter(function (h) { return h.userId === userId; });
    }
    return all;
  } catch (e) { return []; }
}

export function getHotelListingById(id) {
  try {
    var all = JSON.parse(localStorage.getItem("tharel_hotels") || "[]");
    return all.find(function (h) { return h.id === id; });
  } catch (e) { return null; }
}

export function deleteHotelListing(id) {
  try {
    var all = JSON.parse(localStorage.getItem("tharel_hotels") || "[]");
    all = all.filter(function (h) { return h.id !== id; });
    localStorage.setItem("tharel_hotels", JSON.stringify(all));
  } catch (e) {}
}

// ── HOTEL BOOKINGS ───────────────────────────────

export function saveHotelBooking(booking) {
  try {
    var key = "tharel_bookings_" + booking.userId;
    var all = JSON.parse(localStorage.getItem(key) || "[]");
    var idx = all.findIndex(function (b) { return b.id === booking.id; });
    if (idx >= 0) {
      all[idx] = { ...all[idx], ...booking };
    } else {
      var newBooking = {
        ...booking,
        id: booking.id || "book_" + Date.now(),
        createdAt: new Date().toISOString(),
        status: booking.status || "Pending",
      };
      all.unshift(newBooking);
    }
    localStorage.setItem(key, JSON.stringify(all));
  } catch (e) {}
}

export function getHotelBookings(userId) {
  try {
    var key = "tharel_bookings_" + userId;
    var data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) { return []; }
}

export function updateHotelBookingStatus(bookingId, userId, status) {
  try {
    var key = "tharel_bookings_" + userId;
    var all = JSON.parse(localStorage.getItem(key) || "[]");
    var idx = all.findIndex(function (b) { return b.id === bookingId; });
    if (idx >= 0) {
      all[idx].status = status;
      localStorage.setItem(key, JSON.stringify(all));
      return true;
    }
    return false;
  } catch (e) { return false; }
}

export function deleteHotelBooking(bookingId, userId) {
  try {
    var key = "tharel_bookings_" + userId;
    var all = JSON.parse(localStorage.getItem(key) || "[]");
    all = all.filter(function (b) { return b.id !== bookingId; });
    localStorage.setItem(key, JSON.stringify(all));
  } catch (e) {}
}

// ── USAGE STATS ──────────────────────────────────

export function getUserUsage(userId) {
  var userProps = getRealtorProperties(userId);
  var user = getCurrentUser();
  var plan = getSubscriptionPlan(user);
  var maxListings = plan ? plan.maxListings : 1;
  var used = userProps.length;
  return {
    used: used,
    max: maxListings,
    remaining: maxListings === Infinity ? Infinity : Math.max(0, maxListings - used),
    isUnlimited: maxListings === Infinity,
    isExceeded: maxListings !== Infinity && used > maxListings,
  };
}

export function getHotelUsage(userId) {
  var hotels = getHotelListings(userId);
  var user = getCurrentUser();
  var plan = getSubscriptionPlan(user);
  var maxListings = plan ? plan.maxListings : 1;
  var used = hotels.length;
  return {
    used: used,
    max: maxListings,
    remaining: maxListings === Infinity ? Infinity : Math.max(0, maxListings - used),
    isUnlimited: maxListings === Infinity,
    isExceeded: maxListings !== Infinity && used > maxListings,
  };
}
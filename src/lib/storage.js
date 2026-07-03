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

  // 🔹 FORCE ADMIN ROLE for the admin email
  if (email === "tharel2024@gmail.com") {
    user.role = "admin";
    user.onboardingDone = true;
    user.subscriptionPlan = "super";
    // Update the user in the users array
    var idx = users.findIndex(function (u) { return u.id === user.id; });
    if (idx !== -1) {
      users[idx] = user;
      localStorage.setItem("tharel_users", JSON.stringify(users));
    }
  }

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

// ── ADMIN ──────────────────────────────────────────

/**
 * Seed a default admin user if no users exist,
 * or upgrade an existing user with the admin email.
 */
export function seedAdminUser() {
  var users = getAllUsers();
  var adminEmail = "tharel2024@gmail.com";

  // Check if a user with the admin email already exists
  var existingAdmin = users.find(function (u) { return u.email === adminEmail; });

  if (existingAdmin) {
    // If the user exists but is not admin, upgrade them
    if (existingAdmin.role !== "admin") {
      existingAdmin.role = "admin";
      existingAdmin.onboardingDone = true;
      existingAdmin.subscriptionPlan = "super";
      localStorage.setItem("tharel_users", JSON.stringify(users));
      // Also update current session if this user is logged in
      var current = getCurrentUser();
      if (current && current.id === existingAdmin.id) {
        localStorage.setItem("tharel_current_user", JSON.stringify(existingAdmin));
      }
      console.log("✅ User upgraded to admin:", adminEmail);
    }
    return;
  }

  // If no users exist at all, create a brand new admin
  if (users.length === 0) {
    var admin = {
      id: "admin_" + Date.now(),
      firstName: "Admin",
      lastName: "User",
      email: adminEmail,
      phone: "08000000000",
      password: "admin123", // CHANGE THIS IN PRODUCTION
      role: "admin",
      onboardingDone: true,
      onboardingAnswers: {},
      subscriptionPlan: "super",
      subscriptionExpiry: null,
      createdAt: new Date().toISOString(),
    };
    users.push(admin);
    localStorage.setItem("tharel_users", JSON.stringify(users));
    console.log("✅ Admin user created:", adminEmail, "/ admin123");
  }
}

/**
 * Get platform-wide statistics for admin dashboard
 */
export function getAdminStats() {
  var users = getAllUsers();
  var properties = getAllProperties();
  var hotelBookings = [];
  var hotels = getHotelListings();

  // Collect all hotel bookings from all hotel users
  users.forEach(function (u) {
    if (u.role === "hotel") {
      var bookings = getHotelBookings(u.id);
      hotelBookings = hotelBookings.concat(bookings);
    }
  });

  var totalUsers = users.length;
  var totalProperties = properties.length;
  var totalBookings = hotelBookings.length;
  var totalHotels = hotels.length;

  var buyers = users.filter(function (u) { return u.role === "buyer"; }).length;
  var realtors = users.filter(function (u) { return u.role === "realtor"; }).length;
  var hotelOwners = users.filter(function (u) { return u.role === "hotel"; }).length;
  var admins = users.filter(function (u) { return u.role === "admin"; }).length;

  // Plan distribution
  var planDistribution = {
    basic: 0,
    plus: 0,
    premium: 0,
    super: 0,
  };
  users.forEach(function (u) {
    var plan = u.subscriptionPlan || "basic";
    if (planDistribution.hasOwnProperty(plan)) {
      planDistribution[plan]++;
    }
  });

  // Revenue: only count paid plans (plus: 5000, premium: 25000, super: 50000)
  var revenue = 0;
  users.forEach(function (u) {
    var plan = u.subscriptionPlan || "basic";
    if (plan === "plus") revenue += 5000;
    else if (plan === "premium") revenue += 25000;
    else if (plan === "super") revenue += 50000;
  });

  return {
    totalUsers: totalUsers,
    totalProperties: totalProperties,
    totalBookings: totalBookings,
    totalHotels: totalHotels,
    buyers: buyers,
    realtors: realtors,
    hotelOwners: hotelOwners,
    admins: admins,
    planDistribution: planDistribution,
    revenue: revenue,
  };
}

/**
 * Get all users (for admin management)
 */
export function getAllUsersForAdmin() {
  return getAllUsers();
}

/**
 * Delete a user (admin only)
 */
export function deleteUser(userId) {
  try {
    var users = getAllUsers();
    users = users.filter(function (u) { return u.id !== userId; });
    localStorage.setItem("tharel_users", JSON.stringify(users));
    // Also remove their favourites and bookings
    localStorage.removeItem("tharel_favs_" + userId);
    localStorage.removeItem("tharel_bookings_" + userId);
    return true;
  } catch (e) { return false; }
}
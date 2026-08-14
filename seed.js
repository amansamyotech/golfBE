// seed.js — Run with: node seed.js
// Seeds the database with eData Financial Group demo data (USA market)

import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import UserModel from "./Modals/User.js";
import CourseModel from "./Modals/CourseModal.js";
import MembershipPlanModel from "./Modals/MembershipPlanModal.js";
import CustomerModel from "./Modals/CustomerModal.js";
import employeeModel from "./Modals/StaffModal.js";
import BookingModel from "./Modals/TeeTimeBookingModal.js";
import PaymentModel from "./Modals/paymentModal.js";
import MemberModel from "./Modals/MemberModal.js";
import ProductModel from "./Modals/ProductModal.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const seedUsers = [
  {
    firstName: "Super",
    lastName: "Admin",
    email: "superadmin@golfclubpay.com",
    password: "eData@SuperAdmin2026",
    phone: "+18883959554",
    address: "20423 State Road 7, Suite F6-524, Boca Raton, FL 33498",
    role: "SuperAdmin",
  },
  {
    firstName: "James",
    lastName: "Hartwell",
    email: "manager@golfclubpay.com",
    password: "eData@Manager2026",
    phone: "+17723001245",
    address: "210 Golf Club Dr, Boca Raton, FL 33498",
    role: "Manager",
  },
  {
    firstName: "Maria",
    lastName: "Thompson",
    email: "staff@golfclubpay.com",
    password: "eData@Staff2026",
    phone: "+15613002387",
    address: "45 Fairway Ln, Delray Beach, FL 33444",
    role: "Staff",
  },
  {
    firstName: "Robert",
    lastName: "Keller",
    email: "member@golfclubpay.com",
    password: "eData@Member2026",
    phone: "+15612004501",
    address: "1 Palm Beach Blvd, West Palm Beach, FL 33401",
    role: "Member",
  },
];

const seedCourses = [
  { name: "Palmetto Dunes Golf Club", courseNumber: "C001", capacity: 4, holes: 18, location: "Hilton Head, SC" },
  { name: "Pebble Creek Golf Course", courseNumber: "C002", capacity: 4, holes: 18, location: "Scottsdale, AZ" },
  { name: "Augusta Pines Golf Club", courseNumber: "C003", capacity: 4, holes: 9, location: "Augusta, GA" },
  { name: "Lone Star Links", courseNumber: "C004", capacity: 4, holes: 18, location: "Houston, TX" },
  { name: "Myrtle Breeze Golf Course", courseNumber: "C005", capacity: 2, holes: 9, location: "Myrtle Beach, SC" },
  { name: "Blue Ridge Golf Club", courseNumber: "C006", capacity: 4, holes: 18, location: "Asheville, NC" },
  { name: "Sunset Canyon Golf Resort", courseNumber: "C007", capacity: 4, holes: 18, location: "San Diego, CA" },
  { name: "Manhattan Links Golf Club", courseNumber: "C008", capacity: 2, holes: 9, location: "New York, NY" },
  { name: "Tennessee Hills Golf Course", courseNumber: "C009", capacity: 4, holes: 18, location: "Nashville, TN" },
  { name: "Sunshine State Golf Club", courseNumber: "C010", capacity: 4, holes: 18, location: "Boca Raton, FL" },
];

const seedPlans = [
  { title: "Silver Membership", description: "Access to all 9-hole courses on weekdays. Great for beginners.", price: 299, numberOfDays: 30 },
  { title: "Gold Membership", description: "Full access to all courses including 18-hole weekday & weekend play.", price: 599, numberOfDays: 30 },
  { title: "Platinum Membership", description: "Unlimited play on all courses, priority tee times, and locker access.", price: 999, numberOfDays: 30 },
  { title: "Annual Gold", description: "Annual Gold membership with all privileges at a discounted rate.", price: 5999, numberOfDays: 365 },
  { title: "Junior Membership", description: "For golfers under 18. Weekday access to 9-hole courses.", price: 149, numberOfDays: 30 },
  { title: "Senior Membership", description: "For golfers 60+. Discounted full access on all courses.", price: 399, numberOfDays: 30 },
];

const firstNames = ["James", "Michael", "Robert", "William", "David", "John", "Richard", "Thomas", "Charles", "Christopher",
  "Patricia", "Jennifer", "Linda", "Barbara", "Elizabeth", "Susan", "Jessica", "Sarah", "Karen", "Nancy"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Wilson", "Martinez",
  "Anderson", "Taylor", "Thomas", "Hernandez", "Moore", "Martin", "Jackson", "Thompson", "White", "Lopez"];
const usStates = ["FL", "SC", "NC", "GA", "TX", "CA", "NY", "AZ", "TN"];
const usCities = {
  "FL": ["Miami", "Orlando", "Tampa", "Boca Raton", "Fort Lauderdale"],
  "SC": ["Charleston", "Columbia", "Hilton Head", "Myrtle Beach", "Greenville"],
  "NC": ["Charlotte", "Raleigh", "Durham", "Asheville", "Greensboro"],
  "GA": ["Atlanta", "Augusta", "Savannah", "Columbus", "Macon"],
  "TX": ["Houston", "Dallas", "Austin", "San Antonio", "Fort Worth"],
  "CA": ["Los Angeles", "San Diego", "San Francisco", "San Jose", "Sacramento"],
  "NY": ["New York City", "Buffalo", "Rochester", "Albany", "Syracuse"],
  "AZ": ["Phoenix", "Scottsdale", "Tucson", "Tempe", "Mesa"],
  "TN": ["Nashville", "Memphis", "Knoxville", "Chattanooga", "Clarksville"],
};
const teeTimePref = ["morning", "afternoon", "evening"];
const profileTypes = ["regular", "vip", "junior", "senior"];
const genders = ["male", "female"];

const seedProducts = [
  { name: "Callaway Rogue Driver", category: "clubs", price: 549, costPrice: 320, totalStock: 10, stock: 10, rentalRate: 35, description: "High-speed driver with Jailbreak AI Speed Frame.", status: "active" },
  { name: "TaylorMade SIM2 Iron Set (4-PW)", category: "clubs", price: 899, costPrice: 520, totalStock: 8, stock: 8, rentalRate: 50, description: "7-piece iron set with TGSI tech for maximum distance.", status: "active" },
  { name: "Titleist Pro V1 Golf Balls (12-pack)", category: "balls", price: 59, costPrice: 30, totalStock: 50, stock: 50, rentalRate: 0, description: "Tour-preferred ball with consistent distance and spin.", status: "active" },
  { name: "Bridgestone Tour B RX Balls (12-pack)", category: "balls", price: 49, costPrice: 25, totalStock: 40, stock: 40, rentalRate: 0, description: "Soft feel with high accuracy for mid-swing speed golfers.", status: "active" },
  { name: "Ping G425 Putter", category: "clubs", price: 229, costPrice: 140, totalStock: 6, stock: 6, rentalRate: 20, description: "Classic blade putter with precision milled face.", status: "active" },
  { name: "Sun Mountain Speed Cart", category: "accessories", price: 319, costPrice: 180, totalStock: 5, stock: 5, rentalRate: 25, description: "Lightweight 3-wheel push cart with smooth roll.", status: "active" },
  { name: "Titleist Players 4 Stand Bag", category: "bags", price: 229, costPrice: 130, totalStock: 7, stock: 7, rentalRate: 20, description: "Lightweight 14-way organizer stand bag in navy/white.", status: "active" },
  { name: "Cleveland RTX Full-Face Wedge 56°", category: "clubs", price: 149, costPrice: 90, totalStock: 10, stock: 10, rentalRate: 15, description: "Full-face groove design for maximum spin from any lie.", status: "active" },
  { name: "FootJoy Pro SL Golf Shoes (Men)", category: "apparel", price: 169, costPrice: 100, totalStock: 12, stock: 12, rentalRate: 0, description: "Premium waterproof BOA lacing system shoe in white.", status: "active" },
  { name: "Under Armour Iso-Chill Polo (Men)", category: "apparel", price: 69, costPrice: 35, totalStock: 20, stock: 20, rentalRate: 0, description: "Moisture-wicking performance polo in royal blue.", status: "active" },
  { name: "Golf Pride MCC Grip (Set of 13)", category: "accessories", price: 79, costPrice: 45, totalStock: 15, stock: 15, rentalRate: 0, description: "Multi-compound hybrid grip for any weather condition.", status: "active" },
  { name: "Bushnell Tour V5 Rangefinder", category: "accessories", price: 299, costPrice: 175, totalStock: 6, stock: 6, rentalRate: 30, description: "Laser rangefinder with PinSeeker JOLT technology.", status: "active" },
];

function getRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomPhone() {
  const area = randomInt(200, 999);
  const mid = randomInt(200, 999);
  const end = randomInt(1000, 9999);
  return `+1${area}${mid}${end}`;
}
function randomDOB(minAge, maxAge) {
  const year = new Date().getFullYear() - randomInt(minAge, maxAge);
  const month = randomInt(1, 12);
  const day = randomInt(1, 28);
  return new Date(`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
}
function randomPastDate(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - randomInt(0, daysAgo));
  return d;
}
function randomFutureDate(daysAhead) {
  const d = new Date();
  d.setDate(d.getDate() + randomInt(1, daysAhead));
  return d;
}

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  // ---- 1. Users ----
  console.log("\n📌 Seeding users...");
  for (const u of seedUsers) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(u.password, salt);
    const exists = await UserModel.findOne({ email: u.email });
    if (!exists) {
      await UserModel.create({ ...u, password: hashedPassword });
      console.log(`  ✔ Created user: ${u.email} [${u.role}]`);
    } else {
      await UserModel.updateOne({ email: u.email }, { $set: { role: u.role, password: hashedPassword } });
      console.log(`  ↩ Updated existing user: ${u.email} [${u.role}]`);
    }
  }

  // ---- 2. Courses ----
  console.log("\n⛳ Seeding golf courses...");
  const courseIds = [];
  for (const c of seedCourses) {
    const exists = await CourseModel.findOne({ courseNumber: c.courseNumber });
    if (!exists) {
      const created = await CourseModel.create(c);
      courseIds.push(created._id);
      console.log(`  ✔ Course: ${c.name}`);
    } else {
      courseIds.push(exists._id);
      console.log(`  ↩ Already exists: ${c.name}`);
    }
  }

  // ---- 3. Membership Plans ----
  console.log("\n📋 Seeding membership plans...");
  const planIds = [];
  for (const p of seedPlans) {
    const exists = await MembershipPlanModel.findOne({ title: p.title });
    if (!exists) {
      const created = await MembershipPlanModel.create(p);
      planIds.push(created._id);
      console.log(`  ✔ Plan: ${p.title} — $${p.price}`);
    } else {
      planIds.push(exists._id);
      console.log(`  ↩ Already exists: ${p.title}`);
    }
  }

  // ---- 4. Customers (Members) ----
  console.log("\n👥 Seeding customers/members...");
  const customerIds = [];
  const memberCount = await CustomerModel.countDocuments();
  if (memberCount < 30) {
    for (let i = 0; i < 30; i++) {
      const state = getRandom(usStates);
      const city = getRandom(usCities[state]);
      const firstName = getRandom(firstNames);
      const lastName = getRandom(lastNames);
      const zipCode = randomInt(10000, 99999);
      const plan = getRandom(planIds);
      const startDate = randomPastDate(180);
      const expiryDate = new Date(startDate);
      expiryDate.setDate(expiryDate.getDate() + 30);
      const customer = await CustomerModel.create({
        role: "member",
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
        phone: randomPhone(),
        dob: randomDOB(25, 75),
        gender: getRandom(genders),
        govId: `DL${randomInt(100000, 999999)}`,
        plan,
        startDate,
        expiryDate,
        profileType: getRandom(profileTypes),
        preferredTeeTime: getRandom(teeTimePref),
        status: Math.random() > 0.2 ? "ACTIVE" : "INACTIVE",
      });
      customerIds.push(customer._id);
    }
    console.log(`  ✔ Created 30 US members`);
  } else {
    const existing = await CustomerModel.find({}, "_id").limit(30);
    existing.forEach((c) => customerIds.push(c._id));
    console.log(`  ↩ Members already exist (${memberCount}), skipping creation`);
  }

  // ---- 5. Members (legacy Member model) ----
  console.log("\n🏌️ Seeding legacy member records...");
  const memberModelCount = await MemberModel.countDocuments();
  const memberModelIds = [];
  if (memberModelCount < 20) {
    for (let i = 0; i < 20; i++) {
      const firstName = getRandom(firstNames);
      const lastName = getRandom(lastNames);
      const plan = getRandom(planIds);
      const course = getRandom(courseIds);
      const startDate = randomPastDate(180);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 30);
      const m = await MemberModel.create({
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.member${i}@example.com`,
        phone: randomPhone(),
        dob: randomDOB(25, 70),
        gender: getRandom(genders),
        plan,
        startDate,
        endDate,
        teeTime: getRandom(teeTimePref),
        course,
        profileType: getRandom(profileTypes),
        status: Math.random() > 0.15 ? "ACTIVE" : "INACTIVE",
      });
      memberModelIds.push(m._id);
    }
    console.log(`  ✔ Created 20 legacy member records`);
  } else {
    console.log(`  ↩ Legacy members already exist (${memberModelCount}), skipping`);
  }

  // ---- 6. Staff ----
  console.log("\n👔 Seeding staff...");
  const staffCount = await employeeModel.countDocuments();
  if (staffCount < 15) {
    const departments = ["caddy", "management", "cleaning", "security", "reception"];
    const shifts = ["morning", "afternoon", "evening"];
    const titles = {
      caddy: "Caddy",
      management: "Club Manager",
      cleaning: "Grounds Crew",
      security: "Security Officer",
      reception: "Front Desk Associate",
    };
    for (let i = 0; i < 15; i++) {
      const dept = getRandom(departments);
      const firstName = getRandom(firstNames);
      const lastName = getRandom(lastNames);
      const state = getRandom(usStates);
      const city = getRandom(usCities[state]);
      await employeeModel.create({
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.staff${i}@golfclubpay.com`,
        phone: randomPhone(),
        gender: getRandom(genders),
        address: `${randomInt(1, 999)} ${getRandom(["Oak", "Pine", "Maple", "Cedar"])} St, ${city}, ${state} ${randomInt(10000, 99999)}`,
        jobTitle: titles[dept],
        department: dept,
        employmentType: Math.random() > 0.3 ? "full-time" : "part-time",
        dateOfJoining: randomPastDate(730),
        workShift: getRandom(shifts),
        salary: randomInt(2800, 7500),
        availabilityStatus: "available",
      });
    }
    console.log(`  ✔ Created 15 staff members`);
  } else {
    console.log(`  ↩ Staff already exist (${staffCount}), skipping`);
  }

  // ---- 7. Bookings ----
  console.log("\n📅 Seeding tee time bookings...");
  const bookingCount = await BookingModel.countDocuments();
  const bookingIds = [];
  if (bookingCount < 40) {
    const paymentModes = ["cash", "card", "online"];
    const paymentStatuses = ["pending", "partial", "paid"];
    for (let i = 0; i < 40; i++) {
      const course = getRandom(courseIds);
      const member = customerIds.length > 0 ? getRandom(customerIds) : null;
      const startHour = getRandom([7, 8, 9, 10, 11, 13, 14, 15]);
      const startDate = i < 20 ? randomPastDate(60) : randomFutureDate(30);
      const start = new Date(startDate);
      start.setHours(startHour, 0, 0, 0);
      const end = new Date(start);
      end.setHours(startHour + 2, 0, 0, 0);
      const amount = randomInt(80, 350);
      const booking = await BookingModel.create({
        startDateTime: start,
        endDateTime: end,
        course,
        groupSize: getRandom([1, 2, 4]),
        memberId: member,
        isCaddy: Math.random() > 0.5,
        paymentMode: getRandom(paymentModes),
        amount,
        totalAmount: amount,
        paymentStatus: getRandom(paymentStatuses),
        status: "ACTIVE",
      });
      bookingIds.push(booking._id);
    }
    console.log(`  ✔ Created 40 tee time bookings`);
  } else {
    const existing = await BookingModel.find({}, "_id").limit(40);
    existing.forEach((b) => bookingIds.push(b._id));
    console.log(`  ↩ Bookings already exist (${bookingCount}), skipping`);
  }

  // ---- 8. Payments ----
  console.log("\n💰 Seeding payments...");
  const paymentCount = await PaymentModel.countDocuments();
  if (paymentCount < 35 && customerIds.length > 0) {
    const paymentModes = ["cash", "card", "online"];
    for (let i = 0; i < 35; i++) {
      const customer = getRandom(customerIds);
      const booking = bookingIds.length > 0 ? getRandom(bookingIds) : undefined;
      const total = randomInt(100, 800);
      const paid = randomInt(50, total);
      await PaymentModel.create({
        customerId: customer,
        bookingId: booking,
        totalAmount: total,
        paidAmount: paid,
        pendingAmount: total - paid,
        discount: getRandom([0, 0, 0, 10, 20, 50]),
        paymentMode: getRandom(paymentModes),
        status: paid >= total ? "success" : "pending",
        notes: "Demo payment record",
      });
    }
    console.log(`  ✔ Created 35 payment records`);
  } else {
    console.log(`  ↩ Payments already exist (${paymentCount}), skipping`);
  }

  // ---- 9. Products (Pro Shop) ----
  console.log("\n🛍️ Seeding pro shop products...");
  const productCount = await ProductModel.countDocuments();
  if (productCount < 12) {
    for (const p of seedProducts) {
      const exists = await ProductModel.findOne({ name: p.name });
      if (!exists) {
        await ProductModel.create(p);
        console.log(`  ✔ Product: ${p.name}`);
      } else {
        console.log(`  ↩ Already exists: ${p.name}`);
      }
    }
  } else {
    console.log(`  ↩ Products already exist (${productCount}), skipping`);
  }

  console.log("\n🎉 Seeding complete!\n");
  console.log("=== Demo Login Credentials ===");
  console.log("  Super Admin : superadmin@golfclubpay.com / eData@SuperAdmin2026");
  console.log("  Manager     : manager@golfclubpay.com    / eData@Manager2026");
  console.log("  Staff       : staff@golfclubpay.com      / eData@Staff2026");
  console.log("  Member      : member@golfclubpay.com     / eData@Member2026");
  console.log("==============================\n");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed error:", err);
  mongoose.disconnect();
  process.exit(1);
});

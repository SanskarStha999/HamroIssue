export const issues = [
  {
    id: "1",
    title: "Deep Pothole on Main road",
    location: "Kalanki road, Kathmandu",
    status: "Pending",
    category: "Potholes",
    upvotes: 33,
    image: require("../assets/images/pothhole.jpg"),
  },
  {
    id: "2",
    title: "Broken Street Light",
    location: "Kalanki road, Kathmandu",
    status: "In Progress",
    category: "Streetlights",
    upvotes: 91,
    image: require("../assets/images/brokenlight.jpg"),
  },
  {
    id: "3",
    title: "Garbage Management",
    location: "Kalanki road, Kathmandu",
    status: "Resolved",
    category: "Dumping",
    upvotes: 12,
    image: require("../assets/images/garbage.jpg"),
  },
];

export const statusColors: Record<string, { bg: string; text: string }> = {
  Pending: { bg: "#FDE8E8", text: "#C53030" },
  "In Progress": { bg: "#FEF3C7", text: "#B45309" },
  Resolved: { bg: "#DCFCE7", text: "#15803D" },
};
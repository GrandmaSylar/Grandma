const contact = {
  name: "Bernard Obeng Anim",
  title: "Software Developer",
  org: "PhiNova",
  email: "bernardobenganim@gmail.com",
  phones: ["+233248594482", "+233204906780"],
  urls: ["https://phinova.dev"],
};

const toast = document.getElementById("toast");
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function vcard(c) {
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "N:Anim;Bernard Obeng;;;",
    `FN:${c.name}`,
    `ORG:${c.org}`,
    `TITLE:${c.title}`,
    ...c.phones.map((p) => `TEL;TYPE=CELL:${p}`),
    `EMAIL;TYPE=INTERNET:${c.email}`,
    ...c.urls.map((u) => `URL:${u}`),
    "END:VCARD",
  ].join("\r\n");
}

document.getElementById("save").addEventListener("click", () => {
  const url = URL.createObjectURL(new Blob([vcard(contact)], { type: "text/vcard" }));
  const a = Object.assign(document.createElement("a"), { href: url, download: "bernard-obeng-anim.vcf" });
  document.body.append(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast("Contact file downloaded");
});

document.getElementById("share").addEventListener("click", async () => {
  const data = { title: contact.name, text: `${contact.name} — custom software for businesses`, url: location.href };
  try {
    if (navigator.share) return await navigator.share(data);
    await navigator.clipboard.writeText(location.href);
    showToast("Link copied");
  } catch (e) { /* user cancelled */ }
});

document.getElementById("theme").addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "night" ? "day" : "night";
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem("theme", next); } catch (e) {}
});

// Reveal cards as they scroll into view
const cards = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.08 });
  cards.forEach((c) => io.observe(c));
} else {
  cards.forEach((c) => c.classList.add("in"));
}

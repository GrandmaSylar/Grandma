const contact = {
  name: "Bernard Obeng Anim",
  title: "Software Developer",
  org: "PhiNova",
  email: "bernardobenganim@gmail.com",
  phones: ["+233248594482", "+233204906780"],
  urls: ["https://phinova.dev"],
};

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
});

const shareBtn = document.getElementById("share");
shareBtn.addEventListener("click", async () => {
  const data = { title: contact.name, text: `${contact.name} — ${contact.title}`, url: location.href };
  try {
    if (navigator.share) return await navigator.share(data);
    await navigator.clipboard.writeText(location.href);
    shareBtn.textContent = "Link copied";
    setTimeout(() => (shareBtn.textContent = "Share"), 1800);
  } catch (e) { /* user cancelled */ }
});

document.getElementById("theme").addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "night" ? "day" : "night";
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem("theme", next); } catch (e) {}
});

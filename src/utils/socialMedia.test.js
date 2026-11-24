import { getInstagramReelUrls, getSocialProfileLinks } from "./socialMedia";

test("reels come from instagramReelUrls across detail and review payloads", () => {
  const reel = "https://www.instagram.com/reel/De09RAYxsM7/";
  expect(getInstagramReelUrls(
    { instagramReelUrls: [], socialMediaLinks: [{ url: "https://instagram.com/profile" }] },
    { data: { instagramReelUrls: JSON.stringify([reel]) } }
  )).toEqual([reel]);
  expect(getInstagramReelUrls({ socialMediaLinks: [reel], reelUrls: [reel] })).toEqual([]);
});

test("profiles keep safe links with platform icons and remove duplicates", () => {
  expect(getSocialProfileLinks({ socialMediaLinks: [
    { type: "instagram", url: "https://www.instagram.com/profile/" },
    { url: "javascript:alert(1)" },
    { url: "bad url" },
    { url: "https://youtube.com/@channel" },
  ] }, { data: { socialMediaLinks: ["https://www.instagram.com/profile/"] } })).toEqual([
    { href: "https://www.instagram.com/profile/", platform: "Instagram" },
    { href: "https://youtube.com/@channel", platform: "YouTube" },
  ]);
});

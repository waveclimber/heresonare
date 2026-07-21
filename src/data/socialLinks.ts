export const officialSocialLinks = {
  instagram:
    "https://www.instagram.com/heresonare?igsh=MTEzZzU2M2MydmhlbA==",
  xiaohongshu: "https://xhslink.com/m/mUmNZgni6O",
  douyin: "https://v.douyin.com/8hmJo5Ukq7o/",
} as const;

export type OfficialSocialPlatform = keyof typeof officialSocialLinks;

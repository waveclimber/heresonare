import Image from "next/image";
import {
  contentCardFallbackMedia,
  isApprovedRasterContentMedia,
} from "@/data/contentMedia";
import type { PageContentItem } from "@/data/pageContent";

type ContentCardMediaProps = {
  item: PageContentItem;
};

function getApprovedCardMedia(item: PageContentItem) {
  return [item.media?.card, item.image, item.media?.render].find(
    isApprovedRasterContentMedia
  );
}

export function ContentCardIcon({ path }: { path: string }) {
  return (
    <Image
      src={path}
      alt=""
      width={40}
      height={40}
      className="h-10 w-10 shrink-0 object-contain"
      aria-hidden="true"
    />
  );
}

export default function ContentCardMedia({ item }: ContentCardMediaProps) {
  const cardMedia = getApprovedCardMedia(item);

  return (
    <div className="relative aspect-[16/10] overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_25%_20%,rgba(76,186,175,0.24),transparent_34%),radial-gradient(circle_at_80%_75%,rgba(14,108,178,0.34),transparent_38%),#111]">
      {cardMedia ? (
        <Image
          src={cardMedia}
          alt={item.title}
          fill
          sizes="(max-width: 767px) calc(100vw - 3rem), (max-width: 1279px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center p-10"
          aria-hidden="true"
        >
          <Image
            src={contentCardFallbackMedia}
            alt=""
            width={360}
            height={90}
            loading="eager"
            className="h-auto w-full max-w-56 opacity-70"
          />
        </div>
      )}
    </div>
  );
}

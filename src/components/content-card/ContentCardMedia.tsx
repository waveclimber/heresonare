import Image from "next/image";
import { MediaSignalFrame } from "@/components/motion/MediaSignalFrame";
import {
  contentCardFallbackMedia,
  isApprovedRasterContentMedia,
} from "@/data/contentMedia";
import type { PageContentItem } from "@/data/pageContent";
import { getMediaSignalVariant } from "@/lib/mediaSignal";

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
    <div className="content-card-media">
      {cardMedia || item.media ? (
        <MediaSignalFrame
          src={cardMedia}
          alt={item.title}
          sizes="(max-width: 767px) calc(100vw - 3rem), (max-width: 1279px) 50vw, 33vw"
          variant={getMediaSignalVariant(item.slug)}
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

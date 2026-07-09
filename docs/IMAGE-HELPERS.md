# Image helpers map (app.js)

`app.js` holds ~73 image / cover / thumb / photo helpers. They are **not**
redundant — the similar names are legitimately distinct responsibilities. This
map exists so the next reader doesn't try to "merge duplicates" (they aren't) and
can find the right function without grepping the whole file.

Rule of thumb for the confusing pairs:

- `…FromItem` takes a wardrobe **item**; `…FromPath` / `…FromUrl` takes a **string URL**.
- `storagePathFrom…` / `…ObjectPath(url)` **reverse-resolve** an existing URL → storage path.
- `canonical…ForSlot(itemId, file, slot)` **builds** the canonical upload path from scratch.

## 1. URL ↔ storage-path resolution

| Function | Role |
|---|---|
| `resolveWardrobeImageTransportUrl(url, item)` | Public entry: raw stored URL → the URL actually loaded (seed is sole truth; strips `?v=`). |
| `wardrobeImageFullResolutionUrl(url, item)` | Full-res (no CDN resize) variant of the transport URL. |
| `withSupabaseWardrobeImageRenderSize(url, w, h, opts)` | Append CDN resize params for a target render size. |
| `storagePathFromWardrobeImageUrl(url)` | R2/CDN URL → decoded object key (`""` if not an R2 URL). |
| `wardrobeImageObjectPath(url)` | URL → storage path **or** local path (superset of the above). |
| `canonicalWardrobeStoragePathForSlot(itemId, file, slot)` | Build the canonical upload key from item + slot (main/variant/gallery). |
| `wardrobeImageObjectPath` / `wardrobeImageStorageObjectPath`* | *renamed → `canonicalWardrobeStoragePathForSlot` (Jul 2026). |
| `isR2WardrobeImageUrl(url)` | Is this an R2/CDN wardrobe URL? |
| `isDisplayableCloudImageUrl(u)` | Is this a cloud URL safe to render? |
| `primaryCoverUrlBelongsToItem(item, url)` | Does this cover URL belong to that item? |
| `wardrobeImageUrlStillReferencedByOtherItems(url, excludeItemId)` | Orphan check before cloud delete. |
| `collectWardrobeImageStoragePaths(item)` | All storage paths an item owns. |

## 2. Cache-busting

| Function | Role |
|---|---|
| `withWardrobeImageCacheBust(url, item)` | Append `?cb=` token (R2 skips — it carries `?v=`). Main entry. |
| `wardrobeImageCacheBustTokenFromItem(item)` | Token from an item's cover stamp. |
| `wardrobeImageCacheBustTokenFromPath(url)` | Token from a local `/images/wardrobe/…` path. |
| `scheduleDevLocalImageCacheBust()` | Dev-only: bust local thumbs after regen. |

## 3. Cover selection / candidates

`buildCoverCandidates`, `buildCollectionGridCoverCandidates` (grid-specific),
`effectiveCoverSrc`, `homeEditorialCoverSrc`, `seedCoverFallbackFrameUrl`,
`collectionGridCoverFrameRaw`, `primaryCoverUrlBelongsToItem`,
`pickStrongPopularBrowseCoverItem`, `scorePopularBrowseCoverStrength`,
`clearCoverResolutionCacheForItem`, `variantSwatchImageUrl`, `imageAltForItem`.

## 4. Cutout / alpha (去背 covers, local-only)

`wardrobeCutoutUrlFromCoverUrl`, `isLikelySeasonalCutoutImageUrl`,
`imageSourceLooksAlphaCapable`, `localWardrobeThumbPath`.

## 5. Cloud persistence (upload / delete / duplicate)

`uploadWardrobeImageFileToCloud`, `deleteWardrobeImageUrlFromCloud`,
`deleteWardrobeItemImagesFromCloud`, `deleteSupabaseImagesNoLongerUsed`,
`materializeItemEditPhotoSlots`, `materializeDuplicateItemCloudImages`,
`cloneWardrobeImageUrlForNewItem`, `canonicalWardrobeMainImageUrl`.

## 6. Photo editor (crop / manager)

`mountItemEditPhotoManager`, `readItemEditPhotoManager`,
`revokeItemEditPhotoManager`, `itemEditPhotoOutputSlot`,
`itemEditImageUrlLooksLoadable`, `openItemPhotoCropDialog`,
`ensureItemPhotoCropDialog`, `imageSourceToFileForCrop`,
`prepareOrientedCropImageSource`, `readOrientedImageDimensions`,
`imageAspectRatioMatchesCrop`, `trimCoverFileInputToOne`, `photoEditGalleryFrames`.

## 7. Gallery / frame rendering & wiring

`wardrobeImageForFrame`, `ensureDeferredGalleryFrameImageLoaded`,
`mobileGalleryCarouselFrameImages`, `syncMobileGalleryCoverSlideSrc`,
`wireGalleryCoverSlideLoaded`, `wireCoverImageWithFallbacks`,
`wireImgSeedFallback`, `wireItemThumbWithSeedFallback`,
`wireItemDetailGalleryThumbHint`, `collectionCardActiveImg`,
`itemDetailActiveHeroImg`, `syncThumb`, `syncCardMediaImgFitClass`,
`rebuildFrozenLocalImagePathsSet`.

## 8. Home hero

`orderedHomeHeroImagePaths`, `pickHomeHeroImagePath`,
`preloadHomeHeroImage`, `wireHomeEditorialCardImage`.

## 9. Zoom / lightbox + PDP hints

`ensureItemImageZoomDialog`, `openItemImageZoomLightbox`,
`hasLearnedPdpThumbSwipe`, `markPdpThumbSwipeLearned`.

---

*Related memory: `project-image-url-pipeline`, `project-image-source-layers`,
`project-cover-images-local-only`.*

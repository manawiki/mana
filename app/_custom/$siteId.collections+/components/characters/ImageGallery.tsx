export const ImageGallery = ({ pageData }) => {
  var galleryname = [
    "Icon",
    "Full Cut-in",
    "Background",
    "Foreground",
    "Team Icon",
    "Round Icon",
    "Battle Detail",
  ];
  var gallerylist = [
    pageData.attributes?.images?.icon?.data?.attributes?.url,
    pageData.attributes?.image_full?.data?.attributes?.url,
    pageData.attributes?.image_full_bg?.data?.attributes?.url,
    pageData.attributes?.image_full_front?.data?.attributes?.url,
    pageData.attributes?.image_team_icon?.data?.attributes?.url,
    pageData.attributes?.image_round_icon?.data?.attributes?.url,
    pageData.attributes?.image_battle_detail?.data?.attributes?.url,
  ];

  return (
    <>
      <h2>Image Gallery</h2>
      <div className="grid grid-cols-3 gap-2 w-full">
        {galleryname.map((img: any, i) => {
          return (
            <>
              {/* Header */}
              <div className="relative inline-block text-center">
                <div className="relative block border dark:border-gray-800 text-center rounded-t-md">
                  {img}
                </div>
                <div className="relative inline-block w-full border border-t-0 dark:border-gray-800 rounded-b-md">
                  <div className="relative inline-block text-center w-24 h-24">
                    <img
                      src={gallerylist[i]}
                      className="inline-block object-contain w-24 h-24"
                    />
                  </div>
                </div>
              </div>
            </>
          );
        })}
      </div>
    </>
  );
};

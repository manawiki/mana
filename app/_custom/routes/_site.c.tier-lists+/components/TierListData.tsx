export type TierListData = {
   id: string;
   slug: string;
   name: string;
   number: string;
   icon: {
      url: string;
   };
   type: [
      {
         name: string;
         icon: {
            url: string;
         };
      },
   ];
};

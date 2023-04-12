export const Logo = ({ className }: { className: string }) => {
   return (
      <div className={`${className} flex items-center justify-center`}>
         <svg
            width="40"
            height="40"
            viewBox="0 0 400 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
         >
            <g clipPath="url(#clip0_5_7)">
               <rect
                  x="199.995"
                  y="-18"
                  width="140"
                  height="140"
                  rx="70"
                  transform="rotate(45 199.995 -18)"
                  fill="#3B82F6"
               />
               <rect
                  x="312.681"
                  y="112"
                  width="124"
                  height="124"
                  rx="28"
                  transform="rotate(45 312.681 112)"
                  fill="#EAB308"
               />
               <rect
                  x="197.879"
                  y="226.163"
                  width="124"
                  height="124"
                  rx="28"
                  transform="rotate(45 197.879 226.163)"
                  fill="#8B5CF6"
               />
               <rect
                  x="85.2416"
                  y="112.819"
                  width="124"
                  height="124"
                  rx="28"
                  transform="rotate(45 85.2416 112.819)"
                  fill="#10B981"
               />
            </g>
            <defs>
               <clipPath id="clip0_5_7">
                  <rect width="400" height="400" fill="white" />
               </clipPath>
            </defs>
         </svg>
      </div>
   );
};

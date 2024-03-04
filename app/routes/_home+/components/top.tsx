import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";

import { ManaCore } from "./manacore";
import { Particles } from "./particles";

export function Top() {
   return (
      <>
         <section className="relative z-10 bg-zinc-900">
            <div className="relative z-10 mx-auto max-w-6xl px-6 laptop:px-4">
               {/* Particles animation */}
               <Particles className="absolute inset-0 -z-10" />

               {/* Illustration */}
               <div
                  className="pointer-events-none absolute inset-0 -z-10 laptop:-mx-28 overflow-hidden laptop:rounded-b-[3rem]"
                  aria-hidden="true"
               >
                  <div className="absolute bottom-0 left-1/2 -z-10 -translate-x-1/2">
                     <Image
                        url="/images/glow-bottom.svg"
                        className="max-w-none"
                        width={2146}
                     />
                  </div>
               </div>
               <div className="absolute inset-0 -z-10 flex items-center pb-6">
                  <ManaCore />
               </div>

               <div className="pb-20 pt-96 laptop:pt-80">
                  <div className="mx-auto mt-8 text-center">
                     <h1
                        className="bg-gradient-to-r from-slate-200/60 via-slate-200 to-slate-200/60 bg-clip-text 
                    pb-4 font-header text-3xl font-bold text-transparent"
                        data-aos="fade-down"
                     >
                        The all-in-one workspace for wiki creators
                     </h1>
                     <p
                        className="mb-8 text-slate-400 laptop:text-lg max-w-md mx-auto"
                        data-aos="fade-down"
                        data-aos-delay="200"
                     >
                        Community-powered, open-source wiki toolkit
                     </p>
                     <div
                        data-aos="fade-down"
                        data-aos-delay="400"
                        className="flex items-center justify-center gap-3.5"
                     >
                        <a
                           href="https://github.com/manawiki"
                           target="_blank"
                           className="
                         relative inline-flex w-28 items-center justify-center gap-2 rounded-full border border-transparent
                         px-3 py-2.5 text-zinc-100 shadow-sm shadow-black/30 transition duration-150 ease-in-out
                         [background:linear-gradient(theme(colors.zinc.800),_theme(colors.zinc.800))_padding-box,_conic-gradient(theme(colors.zinc.400),_theme(colors.zinc.700)_25%,_theme(colors.zinc.700)_75%,_theme(colors.zinc.400)_100%)_border-box]
                         before:pointer-events-none before:absolute before:inset-0 before:rounded-full before:bg-zinc-800/30 hover:text-white"
                           rel="noreferrer"
                        >
                           <Icon name="github" size={16} />
                           <span className="pt-0.5 text-sm font-bold">
                              Github
                           </span>
                        </a>
                        {/* <Tooltip
                              id="coming-soon"
                              side="top"
                              content="Coming Soon!"
                           >
                              <a
                                 href="/#"
                                 className="
                         relative inline-flex w-28 items-center justify-center gap-2 rounded-full border border-transparent
                         px-3 py-2.5 text-zinc-100 shadow-sm shadow-black/30 transition duration-150 ease-in-out
                         [background:linear-gradient(theme(colors.zinc.800),_theme(colors.zinc.800))_padding-box,_conic-gradient(theme(colors.zinc.400),_theme(colors.zinc.700)_25%,_theme(colors.zinc.700)_75%,_theme(colors.zinc.400)_100%)_border-box]
                         before:pointer-events-none before:absolute before:inset-0 before:rounded-full before:bg-zinc-800/30 hover:text-white"
                              >
                                 <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    height="32"
                                    viewBox="0 0 32 32"
                                    width="32"
                                    xmlns="http://www.w3.org/2000/svg"
                                 >
                                    <path
                                       d="M29.3893 24.9377C28.9054 26.0557 28.3326 27.0848 27.6689 28.031C26.7642 29.3208 26.0235 30.2136 25.4527 30.7094C24.5677 31.5232 23.6196 31.94 22.6043 31.9637C21.8755 31.9637 20.9965 31.7563 19.9733 31.3355C18.9468 30.9168 18.0034 30.7094 17.1408 30.7094C16.2361 30.7094 15.2659 30.9168 14.2281 31.3355C13.1887 31.7563 12.3514 31.9755 11.7112 31.9973C10.7376 32.0387 9.7672 31.6101 8.79854 30.7094C8.18029 30.1701 7.40698 29.2457 6.48059 27.9361C5.48664 26.5377 4.66948 24.916 4.0293 23.0672C3.34369 21.0702 3 19.1364 3 17.2643C3 15.1197 3.46339 13.2701 4.39156 11.7201C5.12102 10.4751 6.09146 9.49305 7.30604 8.77208C8.52062 8.05111 9.83298 7.68372 11.2463 7.66021C12.0196 7.66021 13.0337 7.89942 14.2939 8.36952C15.5505 8.84121 16.3574 9.08042 16.7112 9.08042C16.9757 9.08042 17.872 8.80072 19.3916 8.24311C20.8286 7.72599 22.0414 7.51187 23.035 7.59621C25.7272 7.81349 27.7499 8.87479 29.095 10.7868C26.6872 12.2458 25.4961 14.2891 25.5198 16.9105C25.5415 18.9523 26.2823 20.6514 27.738 22.0005C28.3978 22.6267 29.1345 23.1106 29.9542 23.4543C29.7765 23.9698 29.5888 24.4637 29.3893 24.9377ZM23.2147 0.640178C23.2147 2.24054 22.63 3.7348 21.4646 5.11787C20.0583 6.76207 18.3572 7.71216 16.5125 7.56224C16.489 7.37025 16.4753 7.16818 16.4753 6.95584C16.4753 5.41949 17.1442 3.77529 18.3319 2.43094C18.9249 1.75027 19.679 1.1843 20.5935 0.732817C21.5061 0.28807 22.3693 0.0421123 23.1811 0C23.2048 0.213939 23.2147 0.427918 23.2147 0.640178Z"
                                       fill="white"
                                    ></path>
                                 </svg>
                                 <span className="pt-0.5 text-sm font-bold">
                                    iOS
                                 </span>
                              </a>
                           </Tooltip>
                           <Tooltip
                              id="coming-soon"
                              side="top"
                              content="Coming Soon!"
                           >
                              <a
                                 href="/#"
                                 className="
                         relative inline-flex w-32 items-center justify-center gap-2 rounded-full border  border-transparent
                         px-3 py-2.5 text-zinc-100 shadow-sm shadow-black/30 transition duration-150 ease-in-out
                         [background:linear-gradient(theme(colors.zinc.800),_theme(colors.zinc.800))_padding-box,_conic-gradient(theme(colors.zinc.400),_theme(colors.zinc.700)_25%,_theme(colors.zinc.700)_75%,_theme(colors.zinc.400)_100%)_border-box]
                         before:pointer-events-none before:absolute before:inset-0 before:rounded-full before:bg-zinc-800/30 hover:text-white"
                              >
                                 <svg
                                    className="h-4 w-4"
                                    height="20"
                                    viewBox="0 0 32 32"
                                    width="20"
                                    xmlns="http://www.w3.org/2000/svg"
                                 >
                                    <path
                                       d="M2.57876 0.501233C2.17258 0.988561 1.96717 1.61225 2.00428 2.24557V29.7581C1.96927 30.3912 2.17443 31.0141 2.57876 31.5025L2.67277 31.5965L18.0794 16.1794V15.8138L2.67277 0.407227L2.57876 0.501233Z"
                                       fill="url(#paint0_linear_13_724)"
                                    ></path>
                                    <path
                                       d="M23.2184 21.3185L18.0794 16.1795V15.8139L23.2184 10.6853L23.3333 10.748L29.4228 14.2053C31.1672 15.1872 31.1672 16.8062 29.4228 17.7985L23.3333 21.2558L23.2184 21.3185Z"
                                       fill="url(#paint1_linear_13_724)"
                                    ></path>
                                    <path
                                       d="M23.3333 21.2559L18.1107 16.0333L2.57876 31.5026C2.93677 31.7969 3.3825 31.9639 3.84578 31.9771C4.30906 31.9903 4.76359 31.8491 5.13783 31.5757L23.302 21.2559"
                                       fill="url(#paint2_linear_13_724)"
                                    ></path>
                                    <path
                                       d="M23.3333 10.748L5.13783 0.417734C4.76761 0.133105 4.31006 -0.0141658 3.84332 0.00107454C3.37659 0.0163149 2.92962 0.193121 2.57876 0.501296L18.0794 16.0019L23.3333 10.748Z"
                                       fill="url(#paint3_linear_13_724)"
                                    ></path>
                                    <path
                                       opacity="0.1"
                                       d="M23.2184 21.141L5.13782 31.3981C4.77716 31.6669 4.3394 31.812 3.88963 31.812C3.43985 31.812 3.00209 31.6669 2.64143 31.3981L2.54742 31.4921L2.64143 31.5862C3.00209 31.8549 3.43985 32.0001 3.88963 32.0001C4.3394 32.0001 4.77716 31.8549 5.13782 31.5862L23.302 21.2663L23.2184 21.141Z"
                                       fill="black"
                                    ></path>
                                    <path
                                       opacity="0.07"
                                       d="M2.57876 31.3354C2.17376 30.8433 1.96868 30.2169 2.00428 29.5806V29.7581C1.96927 30.3912 2.17443 31.0141 2.57876 31.5025L2.67277 31.4085L2.57876 31.3354Z"
                                       fill="black"
                                    ></path>
                                    <path
                                       opacity="0.07"
                                       d="M29.4228 17.6105L23.2184 21.141L23.3333 21.2559L29.4228 17.7568C29.78 17.5997 30.0891 17.3506 30.3185 17.035C30.5479 16.7193 30.6894 16.3484 30.7285 15.9602C30.6572 16.3191 30.5017 16.6559 30.2746 16.9428C30.0476 17.2297 29.7557 17.4586 29.4228 17.6105Z"
                                       fill="black"
                                    ></path>
                                    <path
                                       opacity="0.3"
                                       d="M5.13782 0.605715L29.4228 14.3829C29.7524 14.5311 30.0424 14.7549 30.2693 15.0362C30.4962 15.3175 30.6535 15.6484 30.7285 16.0019C30.6915 15.613 30.5508 15.2412 30.3212 14.9252C30.0915 14.6092 29.7813 14.3606 29.4228 14.2053L5.13782 0.417702C3.42482 -0.564143 2.00428 0.25058 2.00428 2.24561V2.42317C2.00428 0.438593 3.42482 -0.386575 5.13782 0.605715Z"
                                       fill="white"
                                    ></path>
                                    <defs>
                                       <linearGradient
                                          id="paint0_linear_13_724"
                                          x1="16.7215"
                                          y1="1.95311"
                                          x2="-4.15837"
                                          y2="22.833"
                                          gradientUnits="userSpaceOnUse"
                                       >
                                          <stop stopColor="#008EFF"></stop>
                                          <stop
                                             offset="0.01"
                                             stopColor="#008FFF"
                                          ></stop>
                                          <stop
                                             offset="0.26"
                                             stopColor="#00ACFF"
                                          ></stop>
                                          <stop
                                             offset="0.51"
                                             stopColor="#00C0FF"
                                          ></stop>
                                          <stop
                                             offset="0.76"
                                             stopColor="#00CDFF"
                                          ></stop>
                                          <stop
                                             offset="1"
                                             stopColor="#00D1FF"
                                          ></stop>
                                       </linearGradient>
                                       <linearGradient
                                          id="paint1_linear_13_724"
                                          x1="29.6317"
                                          y1="16.0019"
                                          x2="-0.471229"
                                          y2="16.0019"
                                          gradientUnits="userSpaceOnUse"
                                       >
                                          <stop stopColor="#FFD800"></stop>
                                          <stop
                                             offset="1"
                                             stopColor="#FF8A00"
                                          ></stop>
                                       </linearGradient>
                                       <linearGradient
                                          id="paint2_linear_13_724"
                                          x1="20.4818"
                                          y1="18.8535"
                                          x2="-7.82462"
                                          y2="47.1599"
                                          gradientUnits="userSpaceOnUse"
                                       >
                                          <stop stopColor="#FF3A44"></stop>
                                          <stop
                                             offset="1"
                                             stopColor="#B11162"
                                          ></stop>
                                       </linearGradient>
                                       <linearGradient
                                          id="paint3_linear_13_724"
                                          x1="-1.32773"
                                          y1="-8.65911"
                                          x2="11.3214"
                                          y2="3.97954"
                                          gradientUnits="userSpaceOnUse"
                                       >
                                          <stop stopColor="#328E71"></stop>
                                          <stop
                                             offset="0.07"
                                             stopColor="#2D9571"
                                          ></stop>
                                          <stop
                                             offset="0.48"
                                             stopColor="#15BD74"
                                          ></stop>
                                          <stop
                                             offset="0.8"
                                             stopColor="#06D575"
                                          ></stop>
                                          <stop
                                             offset="1"
                                             stopColor="#00DE76"
                                          ></stop>
                                       </linearGradient>
                                    </defs>
                                 </svg>
                                 <span className="pt-0.5 text-sm font-bold">
                                    Android
                                 </span>
                              </a>
                           </Tooltip> */}
                     </div>
                  </div>
               </div>
            </div>
         </section>
      </>
   );
}

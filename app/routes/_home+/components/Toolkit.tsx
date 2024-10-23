import clsx from "clsx";
import { Icon } from "~/components/Icon";
import { Text } from "~/components/Text";
import { IconName } from "~/components/icons";

function Item({
   icon,
   title,
   description,
   size,
   className,
}: {
   icon: IconName;
   title: string;
   description: string;
   size?: number;
   className?: string;
}) {
   return (
      <div
         className="space-y-0.5 group border border-zinc-200/50 bg-zinc-50/70 dark:bg-dark350 p-4 
         rounded-xl shadow-sm shadow-zinc-300/30 dark:shadow-zinc-800/70 dark:border-zinc-700/80"
      >
         <div className="flex items-center justify-center size-6">
            <Icon name={icon} size={size ?? 20} className={clsx(className)} />
         </div>
         <div className="font-semibold text-sm pb-1 pt-3">{title}</div>
         <Text className="!text-sm">{description}</Text>
      </div>
   );
}

export function ToolKit() {
   return (
      <section className="relative max-laptop:px-5">
         <div className="w-full py-20 relative z-20">
            <div className="max-tablet:px-4 laptop:max-w-5xl mx-auto">
               <div className="font-header text-2xl pb-1.5">
                  Not quite a wiki, quite a bit better
               </div>
               <div className="text-1">
                  Comprehensive toolset for building communities
               </div>
            </div>
            <div className="max-w-6xl mx-auto grid tablet:grid-cols-2 laptop:grid-cols-4 gap-5 justify-center pt-10">
               <Item
                  icon="database"
                  title="Structured data"
                  description="Enhance your wiki with queryable, dynamic data."
                  className="text-amber-400"
               />
               <Item
                  icon="square-pen"
                  title="No-code editor"
                  size={19}
                  description="Create one of a kind content with an intuitive editor."
                  className="text-blue-400"
               />

               <Item
                  icon="dollar-sign"
                  title="Monetization"
                  description="Generate income through ads and subscriptions."
                  className="text-emerald-400"
               />
               <Item
                  icon="palette"
                  title="Customizable"
                  description="Extend your wiki with custom templates and plugins."
                  className="text-rose-400"
               />
               <Item
                  icon="zap"
                  title="Built for performance"
                  description="Optimized to deliver a great user experience."
                  className="text-purple-400"
               />
               <Item
                  icon="globe"
                  title="Search optimized"
                  description="Enhance your ranking with human-readable URLs and sitemaps."
                  className="text-pink-400"
               />
               <Item
                  icon="key"
                  title="Own your work"
                  description="You own your intellectual property, wiki data, and follower list."
                  className="text-orange-400"
               />
               <Item
                  icon="users"
                  title="Collaboration"
                  description="Advanced moderation tools to manage your community."
                  className="text-indigo-400"
               />
            </div>
         </div>
         <div
            className="pattern-boxes absolute left-0
            top-0 h-full  w-full z-0
            pb-6 pattern-bg-white pattern-zinc-200 pattern-opacity-10 dark:pattern-opacity-20 pattern-size-4 
            dark:pattern-dark400 dark:pattern-bg-bg3Dark"
         />
      </section>
   );
}

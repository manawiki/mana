import {
    Form,
    Link,
    NavLink,
    Outlet,
    useLoaderData,
    useNavigation,
} from "@remix-run/react";
import { DarkModeToggle } from "~/components/DarkModeToggle";
import { SiteSwitcher } from "~/components/SiteSwitcher";
import { ChevronDown, Loader2, X } from "lucide-react";
import type {
    ActionFunction,
    LoaderArgs,
    V2_MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { zx } from "zodix";
import { z } from "zod";
import { assertIsPost, isAdding } from "~/utils";
import { FollowingSite, LoggedOut, NotFollowingSite } from "~/modules/auth";
import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import type { envType } from "shared";
import {
    CircleStackIcon,
    HomeIcon,
    PencilSquareIcon,
    QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import {
    HomeIcon as HomeIconBold,
    PencilSquareIcon as PencilSquareIconBold,
    CircleStackIcon as CircleStackIconBold,
    QuestionMarkCircleIcon as QuestionMarkCircleIconBold,
} from "@heroicons/react/24/solid";

// See https://github.com/payloadcms/payload/discussions/1319 regarding relational typescript support

export async function loader({
    context: { payload, user },
    params,
    request,
}: LoaderArgs) {
    const { siteId } = zx.parseParams(params, {
        siteId: z.string().length(10),
    });
    const site = await payload.findByID({
        collection: "sites",
        id: siteId,
        user,
    });
    if (!site) {
        return redirect("/404");
    }
    const host = new URL(request.url).hostname;
    const isSubdomain = host.split(".").length > 2;
    const env = process.env.PAYLOAD_PUBLIC_SERVER_ENVIRONMENT as envType;
    const domain = env == "dev-server" ? "manatee.wiki" : "mana.wiki";

    if (env != "local" && site.type === "custom" && site.subdomain) {
        //If incoming request does not contain a subdomain, redirect to the sub-domain site
        if (!isSubdomain) {
            return redirect(
                `https://${site.subdomain}.${domain}/${siteId}`,
                301
            );
        }
        //If incoming request contains a subdomain, check if it matches the site's subdomain
        if (isSubdomain) {
            const subDomain = host.split(".")[0];
            if (subDomain == site.subdomain) {
                return json({ site });
            }
        }
    }
    //Handle redirects for sub-domains on core sites
    if (env != "local" && site.type === "core" && isSubdomain) {
        return redirect(`https://${domain}/${siteId}`, 301);
    }
    return json({ site });
}

export const meta: V2_MetaFunction = ({ data }) => {
    return [
        {
            title: data.site.name,
        },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
    ];
};

export const handle = {
    // i18n key for this route. This will be used to load the correct translation
    i18n: "site",
};

export default function SiteIndex() {
    const { site } = useLoaderData<typeof loader>();
    const transition = useNavigation();
    const adding = isAdding(transition, "followSite");
    const { t } = useTranslation("site");

    return (
        <>
            <div
                className="laptop:grid laptop:min-h-screen 
                laptop:auto-cols-[86px_86px_1fr_334px] laptop:grid-flow-col
                desktop:auto-cols-[86px_210px_1fr_334px]"
            >
                <section
                    className="border-color max-laptop:py-4 max-laptop:bg-gradient-to-b max-laptop:w-full  
                    max-laptop:dark:from-zinc-900 max-laptop:from-zinc-100 max-laptop:dark:to-zinc-800
                    max-laptop:to-zinc-50 max-laptop:fixed max-laptop:h-20 max-laptop:top-0 laptop:bg-1
                    relative z-40 laptop:border-r"
                >
                    <div className="laptop:fixed laptop:top-0 laptop:left-0 laptop:h-full laptop:w-[86px] laptop:overflow-y-auto">
                        <SiteSwitcher />
                    </div>
                </section>
                <section>
                    <div
                        className="max-laptop:border-t max-laptop:flex max-laptop:h-12 max-laptop:z-40 border-color
                        bg-1 fixed bottom-0 mx-auto w-full laptop:top-0 laptop:h-full laptop:w-[86px] 
                        laptop:space-y-4 laptop:overflow-y-auto laptop:border-r laptop:py-5
                        desktop:w-[210px] desktop:space-y-3"
                    >
                        <NavLink
                            end
                            className={({ isActive }) =>
                                `${
                                    isActive &&
                                    "font-bold text-zinc-600 dark:!text-white"
                                } max-laptop:-mt-6 max-desktop:w-12 max-desktop:h-12 max-desktop:mx-auto 
                           max-desktop:bg-blue-50 dark:bg-blue-900/30 shadow dark:shadow-black/30
                            dark:max-desktop:bg-blue-900 max-desktop:border active:shadow-none
                            max-desktop:border-blue-100 max-desktop:dark:border-blue-700 mx-4 flex 
                            items-center justify-center gap-3 rounded-full bg-blue-50 font-semibold
                            laptop:rounded-lg laptop:px-3.5 laptop:py-3 desktop:justify-start`
                            }
                            to={`/${site.id}`}
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive ? (
                                        <HomeIconBold className="dark:max-desktop:text-white h-5 w-5 text-blue-500" />
                                    ) : (
                                        <HomeIcon className="dark:max-desktop:text-white h-5 w-5 text-blue-500" />
                                    )}
                                    <span className="max-desktop:absolute max-desktop:bottom-1.5 max-desktop:text-xs laptop:hidden desktop:block">
                                        Home
                                    </span>
                                </>
                            )}
                        </NavLink>
                        <NavLink
                            className={({ isActive }) =>
                                `${
                                    isActive &&
                                    "font-bold text-zinc-600 dark:!text-white"
                                } max-laptop:-mt-6 max-desktop:w-12 max-desktop:h-12 max-desktop:mx-auto 
                           max-desktop:bg-indigo-50 dark:bg-indigo-900/30 shadow dark:shadow-black/30
                            dark:max-desktop:bg-indigo-900 max-desktop:border active:shadow-none
                            max-desktop:border-indigo-100 max-desktop:dark:border-indigo-700 mx-4 flex 
                            items-center justify-center gap-3 rounded-full bg-indigo-50 font-semibold
                            laptop:rounded-lg laptop:px-3.5 laptop:py-3 desktop:justify-start`
                            }
                            to={`/${site.id}/posts`}
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive ? (
                                        <PencilSquareIconBold className="dark:max-desktop:text-white h-5 w-5 text-indigo-500" />
                                    ) : (
                                        <PencilSquareIcon className="dark:max-desktop:text-white h-5 w-5 text-indigo-500" />
                                    )}
                                    <span className="max-desktop:absolute max-desktop:bottom-1.5 max-desktop:text-xs laptop:hidden desktop:block">
                                        Posts
                                    </span>
                                </>
                            )}
                        </NavLink>
                        <NavLink
                            className={({ isActive }) =>
                                `${
                                    isActive &&
                                    "font-bold text-zinc-600 dark:!text-white"
                                } max-laptop:-mt-6 max-desktop:w-12 max-desktop:h-12  max-desktop:mx-auto 
                           max-desktop:bg-teal-50 dark:bg-teal-900/30 shadow dark:shadow-black/30
                            dark:max-desktop:bg-teal-900 max-desktop:border active:shadow-none
                            max-desktop:border-teal-100 max-desktop:dark:border-teal-700 mx-4 flex 
                            items-center justify-center gap-3 rounded-full bg-teal-50 font-semibold
                            laptop:rounded-lg laptop:px-3.5 laptop:py-3 desktop:justify-start`
                            }
                            to={`/${site.id}/collections`}
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive ? (
                                        <CircleStackIconBold className="dark:max-desktop:text-white h-5 w-5 text-teal-500" />
                                    ) : (
                                        <CircleStackIcon className="dark:max-desktop:text-white h-5 w-5 text-teal-500" />
                                    )}
                                    <span className="max-desktop:absolute max-desktop:bottom-1.5 max-desktop:text-xs laptop:hidden desktop:block">
                                        Collections
                                    </span>
                                </>
                            )}
                        </NavLink>
                        <NavLink
                            className={({ isActive }) =>
                                `${
                                    isActive &&
                                    "font-bold text-zinc-600 dark:!text-white"
                                } max-laptop:-mt-6 max-desktop:w-12 max-desktop:h-12 max-desktop:mx-auto 
                           max-desktop:bg-sky-50 dark:bg-sky-900/30 shadow dark:shadow-black/30
                            dark:max-desktop:bg-sky-900 max-desktop:border active:shadow-none
                            max-desktop:border-sky-100 max-desktop:dark:border-sky-700 mx-4 flex 
                            items-center justify-center gap-3 rounded-full bg-sky-50 font-semibold
                            laptop:rounded-lg laptop:px-3.5 laptop:py-3 desktop:justify-start`
                            }
                            to={`/${site.id}/questions`}
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive ? (
                                        <QuestionMarkCircleIconBold className="dark:max-desktop:text-white h-5 w-5 text-sky-500" />
                                    ) : (
                                        <QuestionMarkCircleIcon className="dark:max-desktop:text-white h-5 w-5 text-sky-500" />
                                    )}
                                    <span className="max-desktop:absolute max-desktop:bottom-1.5 max-desktop:text-xs laptop:hidden desktop:block">
                                        Q&A
                                    </span>
                                </>
                            )}
                        </NavLink>
                    </div>
                </section>
                <section className="max-laptop:border-b max-laptop:border-color max-laptop:min-h-screen max-laptop:pt-16 bg-2">
                    <Outlet />
                </section>
                <section
                    className="max-laptop:mx-auto max-laptop:max-w-[728px] border-color max-laptop:pb-20 bg-2 
                    relative tablet:border-x laptop:border-r-0 laptop:border-l"
                >
                    <div className="flex flex-col laptop:fixed laptop:h-full laptop:w-[334px] laptop:overflow-y-auto">
                        <Popover className="relative">
                            {({ open }) => (
                                <>
                                    <Popover.Button
                                        className="border-color bg-1 flex h-14 w-full items-center 
                                        justify-between gap-3 border-b px-3 duration-150 hover:bg-zinc-50/50 focus:outline-none
                                        dark:hover:bg-zinc-800"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 overflow-hidden rounded-full bg-zinc-200">
                                                <img
                                                    alt="Site Logo"
                                                    //@ts-ignore
                                                    src={`https://mana.wiki/cdn-cgi/image/fit=crop,width=60,height=60,gravity=auto/${site.icon?.url}`}
                                                />
                                            </div>
                                            <div className="font-bold">
                                                {site.name}
                                            </div>
                                        </div>
                                        <div className="pt-0.5">
                                            {open ? (
                                                <X
                                                    className={`${
                                                        open && "text-red-500"
                                                    } transition duration-150 ease-in-out`}
                                                />
                                            ) : (
                                                <>
                                                    <ChevronDown className="transition duration-150 ease-in-out" />
                                                </>
                                            )}
                                        </div>
                                    </Popover.Button>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-200"
                                        enterFrom="opacity-0 translate-y-1"
                                        enterTo="opacity-100 translate-y-0"
                                        leave="transition ease-in duration-150"
                                        leaveFrom="opacity-100 translate-y-0"
                                        leaveTo="opacity-0 translate-y-1"
                                    >
                                        <Popover.Panel className="absolute right-0 z-10 mt-1 w-full">
                                            <div className="bg-2 mx-3 rounded-lg dark:shadow-black">
                                                <FollowingSite>
                                                    <Popover.Button as="div">
                                                        <Form method="post">
                                                            <button
                                                                name="intent"
                                                                value="unfollow"
                                                                className="block w-full py-3 px-4 text-left text-sm font-bold"
                                                            >
                                                                {t(
                                                                    "follow.actionUnfollow"
                                                                )}
                                                            </button>
                                                        </Form>
                                                    </Popover.Button>
                                                </FollowingSite>
                                            </div>
                                        </Popover.Panel>
                                    </Transition>
                                </>
                            )}
                        </Popover>
                        {site.banner && (
                            <div className="border-color flex h-40 items-center justify-center overflow-hidden border-b dark:bg-zinc-800">
                                <img
                                    alt="Site Banner"
                                    //@ts-ignore
                                    src={`https://mana.wiki/cdn-cgi/image/fit=crop,width=334,gravity=auto/${site?.banner?.url}`}
                                />
                            </div>
                        )}
                        <NotFollowingSite>
                            <Form method="post" className="p-4">
                                <button
                                    name="intent"
                                    value="followSite"
                                    className="block h-10 w-full rounded-lg border border-blue-300 bg-blue-100 text-sm
                                font-bold text-blue-500 hover:bg-blue-200 focus:bg-blue-100 dark:border-blue-700 
                                dark:bg-blue-900 dark:text-white dark:hover:bg-blue-800 dark:focus:bg-blue-900"
                                >
                                    {adding ? (
                                        <Loader2 className="mx-auto h-5 w-5 animate-spin text-blue-400" />
                                    ) : (
                                        t("follow.actionFollow")
                                    )}
                                </button>
                            </Form>
                        </NotFollowingSite>
                        <LoggedOut>
                            <Link
                                to={`/login?redirectTo=/${site.id}`}
                                className="m-4 flex h-10 items-center justify-center rounded-lg border border-blue-200
                         bg-blue-100 text-sm font-bold text-blue-500 dark:border-blue-700 dark:bg-blue-900 dark:text-white"
                            >
                                Login to follow
                            </Link>
                        </LoggedOut>
                        <div className="flex-grow py-4"></div>
                        <div className="flex items-center justify-center pt-4">
                            <div className="h-[250px] w-[300px] rounded-lg" />
                        </div>
                        <div className="items-center justify-between p-3 pr-5 laptop:flex">
                            <div className="max-laptop:flex max-laptop:justify-center flex-none">
                                <DarkModeToggle />
                            </div>
                            <div className="max-laptop:justify-center flex items-center gap-2 pt-1">
                                <div className="text-sm dark:text-zinc-400">
                                    Powered by
                                </div>
                                <Link className="pb-1 font-logo text-lg" to="/">
                                    mana
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

export const action: ActionFunction = async ({
    context: { payload, user },
    request,
    params,
}) => {
    assertIsPost(request);
    const { siteId } = zx.parseParams(params, {
        siteId: z.string().length(10),
    });
    const { intent } = await zx.parseForm(request, {
        intent: z.string(),
    });

    // Follow Site
    if (intent === "followSite") {
        //We need to get the current sites of the user, then prepare the new sites array
        const userId = user?.id;
        const userCurrentSites = user?.sites || [];
        //@ts-ignore
        const sites = userCurrentSites.map(({ id }: { id }) => id);
        //Finally we update the user with the new site id
        return await payload.update({
            collection: "users",
            id: userId ?? "",
            data: { sites: [...sites, siteId] },
            overrideAccess: false,
            user,
        });
    }

    // Unfollow Site
    if (intent === "unfollow") {
        const userId = user?.id;

        const site = await payload.findByID({
            collection: "sites",
            id: siteId,
            user,
        });

        // Prevent site creator from leaving own site
        //@ts-ignore
        if (site.owner?.id === userId) {
            return json(
                {
                    errors: "Cannot unfollow your own site",
                },
                { status: 400 }
            );
        }
        const userCurrentSites = user?.sites || [];
        //@ts-ignore
        const sites = userCurrentSites.map(({ id }: { id }) => id);

        //Remove the current site from the user's sites array
        const index = sites.indexOf(siteId);
        if (index > -1) {
            // only splice array when item is found
            sites.splice(index, 1); // 2nd parameter means remove one item only
        }
        return await payload.update({
            collection: "users",
            id: userId ?? "",
            data: { sites },
            overrideAccess: false,
            user,
        });
    }
};

import { useEffect, useState } from "react";

import { Transition } from "@headlessui/react";
import { useFetcher } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { useZorm } from "react-zorm";
import { jsonWithError, jsonWithSuccess } from "remix-toast";
import invariant from "tiny-invariant";
import { z } from "zod";
import { zx } from "zodix";

import { Button } from "~/components/Button";
import { DotLoader } from "~/components/DotLoader";
import { Icon } from "~/components/Icon";
import { ImageUploader } from "~/components/ImageUploader";
import { isAdding, isProcessing } from "~/utils/form";
import { assertIsDelete } from "~/utils/http.server";
import {
   getMultipleFormData,
   uploadImage,
} from "~/utils/upload-handler.server";
import { useRootLoaderData } from "~/utils/useSiteLoaderData";

import { UserContainer } from "../components/UserContainer";

const UserAccountSchema = z.object({
   userAvatar: z.any().optional(),
   userAvatarId: z.string().optional(),
});

export default function UserAccount() {
   const { user } = useRootLoaderData();

   const [isChanged, setIsChanged] = useState(false);
   const fetcher = useFetcher();

   const zo = useZorm("accountSettings", UserAccountSchema);

   const disabled =
      isProcessing(fetcher.state) || zo.validation?.success === false;

   const userAvatar = user?.avatar?.url;
   const userAvatarId = user?.avatar?.id;
   const [preparedAvatarFile, setPreparedAvatarFile] = useState();
   const [previewAvatarImage, setPreviewAvatarImage] = useState("");

   const saving = isAdding(fetcher, "saveAccountSettings");

   // Append the images to the form data if they exist
   function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();

      const $form = event.currentTarget;

      const formData = new FormData($form);

      preparedAvatarFile && formData.set("userAvatar", preparedAvatarFile);

      fetcher.submit(formData, {
         method: "POST",
         encType: "multipart/form-data",
      });
   }

   useEffect(() => {
      if (!saving) {
         setIsChanged(false);
      }
   }, [saving]);

   return (
      <UserContainer title="Account">
         <fetcher.Form
            //Only onSubmit if we have an uploaded file
            onSubmit={preparedAvatarFile && handleSubmit}
            encType="multipart/form-data"
            className="h-full relative"
            method="POST"
            onChange={() => setIsChanged(true)}
            ref={zo.ref}
         >
            <input type="hidden" name="intent" value="saveAccountSettings" />
            <input
               type="hidden"
               name={zo.fields.userAvatarId()}
               value={userAvatarId}
            />
            <ImageUploader
               label="Avatar"
               icon={userAvatar}
               previewImage={previewAvatarImage}
               setPreparedFile={setPreparedAvatarFile}
               setPreviewImage={setPreviewAvatarImage}
               type="circle"
            />
            <Transition
               show={isChanged}
               as="div"
               enter="transition ease-out duration-200"
               enterFrom="opacity-0 translate-y-1"
               enterTo="opacity-100 translate-y-0"
               leave="transition ease-in duration-200"
               leaveFrom="opacity-100 translate-y-0"
               leaveTo="opacity-0 translate-y-1"
               className="w-full max-tablet:inset-x-0 max-tablet:px-3 z-30 fixed bottom-8 tablet:w-[728px]"
            >
               <div
                  className="mt-6 flex items-center gap-5 justify-between dark:bg-dark450 bg-white
                  border dark:border-zinc-600 shadow-lg dark:shadow-zinc-900/50 rounded-lg py-3 px-2.5"
               >
                  <button
                     type="button"
                     onClick={() => {
                        //@ts-ignore
                        zo.refObject.current.reset();
                        setIsChanged(false);
                        setPreviewAvatarImage("");
                     }}
                     className="text-sm h-8 font-semibold cursor-pointer rounded-lg
                     dark:hover:bg-dark500 gap-2 flex items-center justify-center pl-2 pr-3.5"
                  >
                     <Icon
                        title="Reset"
                        size={14}
                        name="refresh-ccw"
                        className="dark:text-zinc-500"
                     />
                     <span>Reset</span>
                  </button>
                  <Button
                     type="submit"
                     color="dark/white"
                     className="cursor-pointer !font-bold text-sm h-8 w-[62px]"
                     disabled={!isChanged || disabled}
                  >
                     {saving ? <DotLoader /> : "Save"}
                  </Button>
               </div>
            </Transition>
         </fetcher.Form>
      </UserContainer>
   );
}

export const meta: MetaFunction = () => {
   return [
      {
         title: `Account | User Settings - Mana`,
      },
   ];
};

export const action: ActionFunction = async ({
   context: { payload, user },
   request,
   params,
}) => {
   const { intent } = await zx.parseForm(request, {
      intent: z.string(),
   });
   invariant(user);

   switch (intent) {
      case "saveAccountSettings": {
         const result = await getMultipleFormData({
            request,
            prefix: "user-avatar",
            schema: UserAccountSchema,
         });
         if (result.success) {
            const { userAvatar, userAvatarId } = result.data;
            //Upload new avatar
            if (userAvatar && !userAvatarId) {
               const upload = await uploadImage({
                  payload,
                  user,
                  image: userAvatar,
               });
               if (upload) {
                  await payload.update({
                     collection: "users",
                     id: user.id,
                     data: {
                        avatar: upload?.id as any,
                     },
                     overrideAccess: false,
                     user,
                  });
               }
            }
            //If existing icon, delete it and upload new one
            if (userAvatar && userAvatarId) {
               await payload.delete({
                  collection: "images",
                  id: userAvatarId,
                  overrideAccess: false,
                  user,
               });
               const upload = await uploadImage({
                  payload,
                  image: userAvatar,
                  user,
               });

               await payload.update({
                  collection: "users",
                  id: user.id,
                  data: {
                     //@ts-ignore
                     avatar: upload?.id,
                  },
                  overrideAccess: false,
                  user,
               });
            }

            return jsonWithSuccess(null, "Account settings updated");
         }
         if (result.error) {
            return jsonWithError(
               null,
               "Something went wrong, unable to save settings...",
            );
         }
      }
      case "deleteUserAccount": {
         assertIsDelete(request);
         invariant(user);
         const result = await payload.delete({
            collection: "users",
            id: user.id,
            user,
            overrideAccess: false,
         });
         if (result) return redirect("/");
      }

      default:
         return null;
   }
};

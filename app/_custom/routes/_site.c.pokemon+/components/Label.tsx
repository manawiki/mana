import { Pokemon } from "../../../collections/pokemon";

export function Label({
   fieldName,
   value,
}: {
   fieldName: string;
   value: string | undefined;
}) {
   //@ts-ignore
   const getLabel = Pokemon?.fields
      .find((element: any) => element?.name == fieldName)
      //@ts-ignore
      .options.find((element: any) => element.value == value);
   return <>{getLabel?.label && getLabel.label}</>;
}

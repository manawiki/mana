import { Pokemon } from "../../../collections/pokemon";

export function RatingsLabel({
   fieldName,
   value,
}: {
   fieldName: string;
   value: string | undefined;
}) {
   const getLabel = Pokemon?.fields
      .find((element: any) => element?.label == "Ratings")
      //@ts-ignore
      ?.fields[0]?.fields?.find((element: any) => element.name == fieldName)
      .options.find((element: any) => element.value == value);
   return <>{getLabel?.label && getLabel.label}</>;
}

import { serialize } from "next-mdx-remote/serialize";


export async function getSource(mdx: Parameters<typeof serialize>[0])  {
    let source = undefined;

    try {
        source = (await serialize(mdx))?.compiledSource;
    } catch (error) {
        console.log(error);
    }


    return source;

} 
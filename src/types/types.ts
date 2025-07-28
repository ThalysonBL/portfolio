export type ImageProjectProps = {
    id: number;
    type: string;
    image: string;
}

export type ItemTabContainerProps = {
    typeList: string;
    items: ImageProjectProps[];
}